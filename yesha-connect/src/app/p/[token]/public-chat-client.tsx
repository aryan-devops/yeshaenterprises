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
  ChevronRight,
  Edit2,
  Trash2,
  EyeOff,
  X
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
  isEdited?: boolean
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
  const isEdited = m.content.endsWith('\n*(edited)*')
  const actualContent = isEdited ? m.content.replace(/\n\*(edited)\*$/, '') : m.content

  const prefixMatch = actualContent.match(/^\[([^:]+):\s*([^\]]+)\]:\s*([\s\S]*)$/)
  if (prefixMatch) {
    return {
      senderName: prefixMatch[2],
      isGuest: prefixMatch[1].toLowerCase() === 'guest',
      roleLabel: prefixMatch[1],
      cleanContent: prefixMatch[3],
      isEdited
    }
  }

  if (m.sender_id) {
    return {
      senderName: m.profiles?.full_name || 'User',
      isGuest: false,
      roleLabel: m.profiles?.role?.replace('_', ' ') || 'member',
      cleanContent: actualContent,
      isEdited
    }
  }

  return {
    senderName: 'Anonymous Guest',
    isGuest: true,
    roleLabel: 'Guest',
    cleanContent: actualContent,
    isEdited
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

  // Edit/Delete state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [deleteOptionsForId, setDeleteOptionsForId] = useState<string | null>(null)
  const [hiddenMessages, setHiddenMessages] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('yesha_hidden_messages')
      if (stored) setHiddenMessages(JSON.parse(stored))
    } catch (e) {}
  }, [])

  // Scroll to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDeleteForMe = (messageId: string) => {
    const updated = [...hiddenMessages, messageId]
    setHiddenMessages(updated)
    setDeleteOptionsForId(null)
    localStorage.setItem('yesha_hidden_messages', JSON.stringify(updated))
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', messageId)
      if (error) throw error
      setMessages(prev => prev.filter(m => m.id !== messageId))
      if (socketRef.current) socketRef.current.emit('delete-message', messageId)
    } catch (err: any) {
      console.error('Failed to delete message:', err)
    }
  }

  const handleEditMessage = async (messageId: string) => {
    if (!editingContent.trim()) {
      setEditingMessageId(null)
      return
    }
    try {
      const oldMsg = messages.find(m => m.id === messageId)
      if (!oldMsg) return

      let cleanNew = editingContent.trim().replace(/\s*\(edited\)$/, '')
      const prefixMatch = oldMsg.content.match(/^\[([^:]+):\s*([^\]]+)\]:\s*/)
      if (prefixMatch) {
        cleanNew = `${prefixMatch[0]}${cleanNew}`
      }

      const finalContent = `${cleanNew}\n*(edited)*`

      const { error } = await supabase.from('messages').update({ content: finalContent }).eq('id', messageId)
      if (error) throw error

      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: finalContent } : m))
      setEditingMessageId(null)
      setEditingContent('')
    } catch (err: any) {
      console.error('Failed to edit message:', err)
    }
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
            if (hiddenMessages.includes(m.id)) return null

            const parsed = parseMessageContent(m)
            const messageRole = parsed.isGuest ? 'customer' : getRoleFromLabel(parsed.roleLabel)
            const viewerRole = profile?.role || 'customer'
            const isOwn = viewerRole === 'customer'
              ? messageRole === 'customer'
              : messageRole === viewerRole

            const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const createdAtStr = m.created_at.endsWith('Z') ? m.created_at : m.created_at + 'Z'
            const isEditable = isOwn && (new Date().getTime() - new Date(createdAtStr).getTime()) < 5 * 60 * 1000
            const isEditing = editingMessageId === m.id

            return (
              <div
                key={m.id}
                className={`flex items-start w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[85%] ${isOwn ? 'items-end' : 'items-start'}`}>
                  {/* Sender nickname header */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                    <span className={isOwn ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-650 dark:text-zinc-300'}>
                      {parsed.senderName}
                    </span>
                    <span className="px-1 text-[7px] bg-zinc-200/50 dark:bg-zinc-800 rounded uppercase">
                      {parsed.roleLabel}
                    </span>
                    {parsed.isEdited && (
                      <span className="px-1.5 py-0.5 text-[8px] bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded">
                        Edited
                      </span>
                    )}
                  </div>

                  <div className={`relative group/bubble flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Clean Premium Bubble */}
                    <div className={`rounded-2xl px-3.5 py-2 text-xs shadow-xs relative leading-normal ${
                      isOwn
                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-violet-500/10 min-w-[80px]'
                        : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-850 min-w-[120px]'
                    }`}>
                      {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <textarea 
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className={`bg-black/10 dark:bg-black/20 border-black/10 dark:border-white/10 rounded p-1.5 outline-none resize-none w-full text-xs ${isOwn ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
                            rows={2}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setEditingMessageId(null)} className={`px-2 py-1 rounded hover:bg-black/10 text-[10px] font-medium transition-colors ${isOwn ? 'text-white/80' : 'text-zinc-500'}`}>Cancel</button>
                            <button onClick={() => handleEditMessage(m.id)} className={`px-2 py-1 rounded font-bold text-[10px] hover:bg-white/90 transition-colors shadow-sm ${isOwn ? 'bg-white text-violet-700' : 'bg-violet-600 text-white'}`}>Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-line break-words">{parsed.cleanContent}</p>
                          <span className={`block text-[8px] mt-1.5 font-medium ${isOwn ? 'text-violet-200 text-right' : 'text-zinc-400 dark:text-zinc-500 text-right'}`}>
                            {timeStr}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Icons Overlay (Hover / Slide context) */}
                    {!isEditing && isOwn && (
                      <div className={`transition-all duration-200 flex items-center gap-1 ${deleteOptionsForId === m.id ? 'opacity-100 scale-100' : 'opacity-100 md:opacity-0 md:group-hover/bubble:opacity-100 focus-within:opacity-100 scale-100 md:scale-95 md:group-hover/bubble:scale-100'}`}>
                        {deleteOptionsForId === m.id ? (
                          <div className="flex flex-col gap-1 bg-white dark:bg-zinc-800 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl z-10 text-[9px] font-medium shrink-0 animate-in fade-in zoom-in-95 duration-200">
                            <button onClick={() => handleDeleteForMe(m.id)} className="px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1.5 text-left transition-colors">
                              <EyeOff className="size-3" /> Delete for me
                            </button>
                            <button onClick={() => { setDeleteOptionsForId(null); handleDeleteMessage(m.id); }} className="px-2 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 text-left transition-colors">
                              <Trash2 className="size-3" /> Delete for everyone
                            </button>
                            <button onClick={() => setDeleteOptionsForId(null)} className="px-2 py-1.5 rounded-lg text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 text-left transition-colors">
                              <X className="size-3" /> Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1 shrink-0 bg-white dark:bg-zinc-900/80 backdrop-blur-md p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm" tabIndex={0}>
                            {isEditable && (
                              <button
                                onClick={() => { 
                                  setEditingMessageId(m.id); 
                                  setEditingContent(parsed.cleanContent); 
                                }}
                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-violet-600 transition-colors"
                                title="Edit Message (within 5 mins)"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteOptionsForId(m.id)}
                              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-650 transition-colors"
                              title="Delete Message"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
