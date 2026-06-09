'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { io } from 'socket.io-client'
import {
  Send,
  MessageSquare,
  Loader2,
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface PublicChatProps {
  orderId: string
  chatRoomId: string
  initialProfile?: any
}

interface ParsedMsg {
  senderName: string
  isGuest: boolean
  roleLabel: string
  cleanContent: string
}

const getRoleFromLabel = (label: string): string => {
  const norm = label.toLowerCase().trim()
  if (norm === 'super admin' || norm === 'super_admin') return 'super_admin'
  if (norm === 'manufacturer') return 'manufacturer'
  if (norm === 'customer') return 'customer'
  if (norm === 'guest') return 'customer'
  return norm
}

// Parse message content to separate guest/role prefixes from message body
const parseMessageContent = (m: any): ParsedMsg => {
  const prefixMatch = m.content.match(/^\[([^:]+):\s*([^\]]+)\]:\s*([\s\S]*)$/)
  if (prefixMatch) {
    return {
      senderName: prefixMatch[2],
      isGuest: prefixMatch[1].toLowerCase() === 'guest',
      roleLabel: prefixMatch[1],
      cleanContent: prefixMatch[3]
    }
  }

  if (m.sender_id) {
    return {
      senderName: m.profiles?.full_name || 'User',
      isGuest: false,
      roleLabel: m.profiles?.role?.replace('_', ' ') || 'member',
      cleanContent: m.content
    }
  }

  return {
    senderName: 'Anonymous Guest',
    isGuest: true,
    roleLabel: 'Guest',
    cleanContent: m.content
  }
}

export default function PublicChatClient({ orderId, chatRoomId, initialProfile }: PublicChatProps) {
  const supabase = createClient()
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  const [profile, setProfile] = useState<any | null>(initialProfile || null)
  const [guestName, setGuestName] = useState<string | null>(null)
  const [nicknameInput, setNicknameInput] = useState('')
  
  const [messages, setMessages] = useState<any[]>([])
  const [typedMessage, setTypedMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Scroll to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Setup user profile check and socket connection
  useEffect(() => {
    const checkSession = async () => {
      if (initialProfile) {
        setProfile(initialProfile)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        if (p) {
          setProfile({ ...p, email: user.email })
        }
      } else {
        // Look up local storage guest name
        const storedName = localStorage.getItem('yesha_guest_nickname')
        if (storedName) {
          setGuestName(storedName)
        }
      }
    }

    checkSession()

    // Connect to Socket.io server (env var in prod, localhost in dev)
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000')

    socketRef.current.on('connect', () => {
      console.log('Public portal connected to socket:', socketRef.current.id)
      socketRef.current.emit('join-room', chatRoomId)
    })

    socketRef.current.on('message', (msg: any) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socketRef.current.on('delete-message', (deletedId: string) => {
      setMessages(prev => prev.filter(m => m.id !== deletedId))
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [chatRoomId])

  // Fetch initial messages and poll as backup
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          room_id,
          sender_id,
          content,
          created_at,
          profiles:sender_id (
            full_name,
            role
          )
        `)
        .eq('room_id', chatRoomId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 4000)
    return () => clearInterval(interval)
  }, [chatRoomId])

  // Nickname registration
  const handleRegisterNickname = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = nicknameInput.trim()
    if (!trimmed) return
    localStorage.setItem('yesha_guest_nickname', trimmed)
    setGuestName(trimmed)
  }

  // Send Message Action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedMessage.trim()) return

    const contentText = typedMessage.trim()
    setTypedMessage('')

    // Format content with role prefix
    let finalContent = contentText
    if (!profile) {
      finalContent = `[Guest: ${guestName || 'Anonymous Guest'}]: ${contentText}`
    } else {
      const roleStr = profile.role?.replace('_', ' ') || 'member'
      finalContent = `[${roleStr}: ${profile.full_name || 'User'}]: ${contentText}`
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            room_id: chatRoomId,
            sender_id: profile?.id || null,
            content: finalContent
          }
        ])

      if (error) throw error

      // Optimistically fetch/refresh list
      const { data } = await supabase
        .from('messages')
        .select(`
          id,
          room_id,
          sender_id,
          content,
          created_at,
          profiles:sender_id (
            full_name,
            role
          )
        `)
        .eq('room_id', chatRoomId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)
        const latestMsg = data[data.length - 1]
        if (latestMsg && socketRef.current) {
          socketRef.current.emit('send-message', latestMsg)
        }
      }
    } catch (err: any) {
      console.error('Failed to post message:', err.message || err)
    }
  }

  // Nickname set up screen if no login AND no nickname in session
  if (!profile && !guestName) {
    return (
      <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 shadow-md">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto size-10 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Join Order Discussion</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Enter a temporary nickname to consult with the team on this order status.
            </p>
          </div>
          <form onSubmit={handleRegisterNickname} className="flex gap-2 max-w-sm mx-auto">
            <Input
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Your Nickname"
              maxLength={20}
              className="h-9 text-xs border-zinc-200 bg-white dark:bg-zinc-850 dark:border-zinc-750 focus-visible:ring-violet-500"
            />
            <Button type="submit" size="sm" className="h-9 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1">
              Join <ChevronRight className="size-3.5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 rounded-2xl overflow-hidden shadow-md">
      {/* Top chat banner */}
      <div className="px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-950/40 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="size-3.5 text-violet-500" /> 
          Active Session: <strong className="text-zinc-850 dark:text-zinc-200">{profile ? profile.full_name : `${guestName} (Guest)`}</strong>
        </span>
        {!profile && (
          <button
            onClick={() => {
              localStorage.removeItem('yesha_guest_nickname')
              setGuestName(null)
            }}
            className="text-[10px] text-violet-650 hover:underline font-bold"
          >
            Change Nickname
          </button>
        )}
      </div>

      {/* Unique Message Feed */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] dark:bg-zinc-950/80 border-b border-zinc-150 dark:border-zinc-850">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <MessageSquare className="size-8 text-zinc-300 dark:text-zinc-800 mb-1.5" />
            <p className="text-xs font-semibold">No updates yet. Ask a question!</p>
          </div>
        ) : (
          messages.map((m) => {
            const parsed = parseMessageContent(m)
            const messageRole = parsed.isGuest ? 'customer' : getRoleFromLabel(parsed.roleLabel)
            const viewerRole = profile?.role || 'customer'
            const isOwn = viewerRole === 'customer'
              ? messageRole === 'customer'
              : messageRole === viewerRole

            const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            return (
              <div
                key={m.id}
                className={`flex items-start w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                  {/* Sender nickname header */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                    <span className={isOwn ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-650 dark:text-zinc-300'}>
                      {parsed.senderName}
                    </span>
                    <span className="px-1 text-[7px] bg-zinc-200/50 dark:bg-zinc-800 rounded uppercase">
                      {parsed.roleLabel}
                    </span>
                  </div>

                  {/* Clean Premium Bubble */}
                  <div className={`rounded-2xl px-3.5 py-2 text-xs shadow-xs relative leading-normal ${
                    isOwn
                      ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-violet-500/10'
                      : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-850'
                  }`}>
                    <p className="whitespace-pre-line break-words">{parsed.cleanContent}</p>
                    <span className={`block text-[8px] text-right mt-1.5 font-medium ${isOwn ? 'text-violet-200' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {timeStr}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input controls */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-900 flex gap-2">
        <Input
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Post message to team..."
          className="flex-1 bg-zinc-50/50 border-zinc-200 focus-visible:ring-violet-500 text-xs rounded-xl pl-3"
        />
        <Button type="submit" size="icon" className="rounded-xl shrink-0 bg-violet-600 hover:bg-violet-750 text-white">
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  )
}
