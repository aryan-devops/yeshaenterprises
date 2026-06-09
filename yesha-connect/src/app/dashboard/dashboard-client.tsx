'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logout } from '../login/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Settings,
  LogOut,
  Plus,
  Truck,
  Wrench,
  CheckCircle,
  Clock,
  Menu,
  X,
  FileDown,
  ExternalLink,
  Loader2,
  AlertCircle,
  Building,
  User,
  Phone,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageSquare,
  FileUp,
  Trash2,
  MapPin,
  FileSpreadsheet,
  Camera,
  Copy,
  Check,
  Edit2,
  EyeOff
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const statuses = [
  'Inquiry Received',
  'Quotation Sent',
  'Order Confirmed',
  'Manufacturing Started',
  'Manufacturing Completed',
  'Dispatched',
  'In Transit',
  'Delivered',
  'Installation Scheduled',
  'Installation Completed'
]

const getStatusProgress = (status: string) => {
  const index = statuses.indexOf(status)
  if (index === -1) return 0
  return Math.round(((index + 1) / statuses.length) * 100)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Inquiry Received':
      return 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700'
    case 'Quotation Sent':
      return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800'
    case 'Order Confirmed':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800'
    case 'Manufacturing Started':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800'
    case 'Manufacturing Completed':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800'
    case 'Dispatched':
      return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800'
    case 'In Transit':
      return 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800'
    case 'Delivered':
      return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800'
    case 'Installation Scheduled':
      return 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-800'
    case 'Installation Completed':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800'
    default:
      return 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700'
  }
}

interface OrderMetadata {
  description: string
  quotationNo: string
  customerNo: string
  customerName: string
  customerAddress: string
}

// Helpers to serialize/deserialize metadata into/from the description column
const parseOrderDescription = (descText: string): OrderMetadata => {
  try {
    const parsed = JSON.parse(descText)
    if (parsed && typeof parsed === 'object' && 'quotationNo' in parsed) {
      return {
        description: parsed.description || '',
        quotationNo: parsed.quotationNo || 'N/A',
        customerNo: parsed.customerNo || 'N/A',
        customerName: parsed.customerName || 'N/A',
        customerAddress: parsed.customerAddress || 'N/A'
      }
    }
  } catch (e) {
    // Falls back if plain text is stored
  }
  return {
    description: descText || '',
    quotationNo: 'N/A',
    customerNo: 'N/A',
    customerName: 'N/A',
    customerAddress: 'N/A'
  }
}

const buildOrderDescription = (meta: OrderMetadata): string => {
  return JSON.stringify(meta)
}

// Supabase PostgREST errors serialize as {} — extract real message from any error shape
const supabaseErrMsg = (err: any, fallback = 'An unexpected error occurred.'): string => {
  if (!err) return fallback
  // Plain Error objects
  if (typeof err.message === 'string' && err.message) return err.message
  // PostgREST / Supabase error: { code, details, hint, message }
  if (typeof err.details === 'string' && err.details) return err.details
  if (typeof err.hint === 'string' && err.hint) return err.hint
  // Try JSON stringify to get hidden fields
  try {
    const str = JSON.stringify(err)
    if (str && str !== '{}') return str
  } catch {}
  return fallback
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

const parseMessageContent = (content: string, senderId: any, senderProfile: any): ParsedMsg => {
  const prefixMatch = content.match(/^\[([^:]+):\s*([^\]]+)\]:\s*([\s\S]*)$/)
  if (prefixMatch) {
    return {
      senderName: prefixMatch[2],
      isGuest: prefixMatch[1].toLowerCase() === 'guest',
      roleLabel: prefixMatch[1],
      cleanContent: prefixMatch[3]
    }
  }

  if (senderId) {
    return {
      senderName: senderProfile?.full_name || 'User',
      isGuest: false,
      roleLabel: senderProfile?.role?.replace('_', ' ') || 'member',
      cleanContent: content
    }
  }

  return {
    senderName: 'Anonymous Guest',
    isGuest: true,
    roleLabel: 'Guest',
    cleanContent: content
  }
}

const getIsOwnMessage = (m: any, currentUserRole: string, currentUserId: string): boolean => {
  const parsed = parseMessageContent(m.content, m.sender_id, m.profiles)
  const messageRole = parsed.isGuest ? 'customer' : getRoleFromLabel(parsed.roleLabel)

  if (currentUserRole === 'customer') {
    return messageRole === 'customer'
  }
  if (currentUserRole === 'super_admin') {
    return messageRole === 'super_admin'
  }
  if (currentUserRole === 'manufacturer') {
    return messageRole === 'manufacturer'
  }
  if (currentUserRole === 'technician') {
    return messageRole === 'technician'
  }
  return messageRole === currentUserRole
}

interface DashboardProps {
  initialProfile: any
  initialProjects: any[]
  allProfiles: any[]
}

export default function DashboardClientView({
  initialProfile,
  initialProjects,
  allProfiles
}: DashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  // State overrides for local development simulation
  const [profile, setProfile] = useState(initialProfile)
  const [orders, setOrders] = useState<any[]>(initialProjects)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Interactive Modal states
  const [showAddOrderModal, setShowAddOrderModal] = useState(false)
  const [showAddDocModal, setShowAddDocModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showCreateDispatchModal, setShowCreateDispatchModal] = useState(false)
  const [showTechCompleteModal, setShowTechCompleteModal] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null)
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null)
  const [claimCode, setClaimCode] = useState('')
  const [claimError, setClaimError] = useState('')
  const [claimSuccess, setClaimSuccess] = useState('')
  // Technician-specific order claim states (separate from manufacturer)
  const [techClaimCode, setTechClaimCode] = useState('')
  const [techClaimError, setTechClaimError] = useState('')
  const [techClaimSuccess, setTechClaimSuccess] = useState('')
  
  // Database loading indicators
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form Fields for Orders (Projects renamed)
  const [orderForm, setOrderForm] = useState({
    title: '',
    description: '',
    quotationNo: '',
    customerNo: '',
    customerName: '',
    customerAddress: '',
    manufacturerId: '',
    technicianId: ''
  })

  // Dynamic profiles list state to support immediate update on tech creation
  const [profilesList, setProfilesList] = useState<any[]>(allProfiles || [])

  // Technician creation states
  const [techForm, setTechForm] = useState({ fullName: '', username: '', password: '' })
  const [techError, setTechError] = useState('')
  const [techSuccess, setTechSuccess] = useState('')
  const [techLoading, setTechLoading] = useState(false)
  const [selectedTechIdForAssign, setSelectedTechIdForAssign] = useState('')
  
  const [newDoc, setNewDoc] = useState({ title: '', category: 'Blueprint', fileUrl: '' })
  const [newDispatch, setNewDispatch] = useState({
    driverName: '',
    driverPhone: '',
    vehicleNo: '',
    expectedDelivery: '',
    notes: ''
  })

  // Technician Completion Upload fields
  const [techUpload, setTechUpload] = useState({
    notes: '',
    imageName: '',
    imageBase64: ''
  })
  
  // Chat Room Syncing states
  const [activeOrderIdForChat, setActiveOrderIdForChat] = useState<string | null>(
    initialProjects.length > 0 ? initialProjects[0].id : null
  )
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [typedMessage, setTypedMessage] = useState('')

  // New Chat Feature States
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [deleteOptionsForId, setDeleteOptionsForId] = useState<string | null>(null)
  const [hiddenMessages, setHiddenMessages] = useState<string[]>([])
  
  // Developer sandbox configurations
  const [simulatedRole, setSimulatedRole] = useState(initialProfile.role)
  const [showSandbox, setShowSandbox] = useState(true)

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Connect to Socket.io server (env var in prod, localhost in dev)
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000')

    socketRef.current.on('connect', () => {
      console.log('Connected to socket.io server:', socketRef.current.id)
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
  }, [])

  // --- EFFECTS ---
  useEffect(() => {
    // Load hidden messages for "Delete for me" functionality
    try {
      const stored = localStorage.getItem('yesha_hidden_messages')
      if (stored) setHiddenMessages(JSON.parse(stored))
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (activeRoomId && socketRef.current) {
      socketRef.current.emit('join-room', activeRoomId)
    }
  }, [activeRoomId])

  // Keep selected order details in sync with the main orders array
  useEffect(() => {
    if (selectedOrderDetails) {
      const updated = orders.find(o => o.id === selectedOrderDetails.id)
      if (updated) {
        setSelectedOrderDetails(updated)
      }
    }
  }, [orders, selectedOrderDetails?.id])

  const handleCopyInviteLink = (order: any) => {
    if (!order || !order.share_token) return
    const link = `${window.location.origin}/yesha-connect/p/${order.share_token}`
    navigator.clipboard.writeText(link)
    setCopiedOrderId(order.id)
    setTimeout(() => {
      setCopiedOrderId(null)
    }, 2000)
  }

  // Sync Customer active tab to Chat only
  useEffect(() => {
    if (profile?.role === 'customer') {
      setActiveTab('chat')
    }
  }, [profile])

  // Sync active order chat room when selected order changes
  useEffect(() => {
    if (!activeOrderIdForChat) {
      setActiveRoomId(null)
      setMessages([])
      return
    }

    const ensureChatRoom = async () => {
      // 1. Search for existing room
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('project_id', activeOrderIdForChat)

      if (error) {
        console.error('Error fetching chat rooms:', error.message || error)
        return
      }

      if (rooms && rooms.length > 0) {
        setActiveRoomId(rooms[0].id)
      } else {
        // 2. Create room if missing
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert([
            {
              project_id: activeOrderIdForChat,
              name: 'General Order Chat',
              type: 'group'
            }
          ])
          .select()
          .single()

        if (!createError && newRoom) {
          setActiveRoomId(newRoom.id)
        } else {
          console.error('Error creating chat room:', createError?.message || createError)
        }
      }
    }

    ensureChatRoom()
  }, [activeOrderIdForChat])

  // Poll messages database every 3 seconds for real-time messaging feel
  useEffect(() => {
    if (!activeRoomId) {
      setMessages([])
      return
    }

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
        .eq('room_id', activeRoomId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [activeRoomId])

  // Developer sandbox: Dynamically updates the role in Supabase database profiles table
  // This authorizes RLS policies for the simulated role on the fly.
  const handleRoleSwitch = async (newRole: string) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profile.id)

      if (error) {
        throw error
      }

      // Update local states
      setProfile((prev: any) => ({ ...prev, role: newRole }))
      setSimulatedRole(newRole)
      
      // Re-fetch orders for the new database permissions
      await refreshProjects()
    } catch (err: any) {
      console.error('Failed database profile role sync:', err)
      setErrorMsg(err.message || 'Supabase profile role update failed. RLS errors might occur.')
      
      // Fallback local state change
      setProfile((prev: any) => ({ ...prev, role: newRole }))
      setSimulatedRole(newRole)
    } finally {
      setLoading(false)
    }
  }

  // Handle creating a new technician profile and credentials
  const handleCreateTechnician = async () => {
    setTechError('')
    setTechSuccess('')
    
    const name = techForm.fullName.trim()
    const user = techForm.username.trim()
    const pass = techForm.password

    if (!name || !user || !pass) {
      setTechError('All fields are required.')
      return
    }

    setTechLoading(true)
    try {
      // 1. Insert profile row into profiles
      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert([
          {
            full_name: name,
            role: 'technician'
          }
        ])
        .select()
        .single()

      if (profileErr) throw profileErr

      // 2. Insert credential row into technician_credentials
      const { error: credErr } = await supabase
        .from('technician_credentials')
        .insert([
          {
            profile_id: newProfile.id,
            username: user,
            password: pass
          }
        ])

      if (credErr) {
        // Rollback profile insert on failure
        await supabase.from('profiles').delete().eq('id', newProfile.id)
        throw credErr
      }

      setTechSuccess(`Technician "${name}" created successfully! Use username "${user}" to log in.`)
      setTechForm({ fullName: '', username: '', password: '' })
      
      // Re-fetch all profiles list to update dropdowns dynamically
      const { data: newProfilesList } = await supabase
        .from('profiles')
        .select('id, full_name, role, company_name')
        .order('full_name', { ascending: true })
      
      if (newProfilesList) {
        setProfilesList(newProfilesList)
      }
    } catch (err: any) {
      console.error('Create technician error:', JSON.stringify(err))
      setTechError(supabaseErrMsg(err, 'Failed to create technician.'))
    } finally {
      setTechLoading(false)
    }
  }

  // Handle assigning a technician to a project
  const handleAssignTechnician = async (projectId: string) => {
    if (!selectedTechIdForAssign) return
    setErrorMsg('')
    try {
      // 1. Remove any existing technician from project_members
      const { data: existingTechs } = await supabase
        .from('project_members')
        .select('user_id, profiles!inner(role)')
        .eq('project_id', projectId)
        .eq('profiles.role', 'technician')

      if (existingTechs && existingTechs.length > 0) {
        const userIds = existingTechs.map(t => t.user_id)
        await supabase
          .from('project_members')
          .delete()
          .eq('project_id', projectId)
          .in('user_id', userIds)
      }

      // 2. Insert new technician member
      const { error } = await supabase
        .from('project_members')
        .insert([{ project_id: projectId, user_id: selectedTechIdForAssign }])

      if (error) throw error

      setSelectedTechIdForAssign('')
      
      // Update selectedOrderDetails locally to show immediate result
      const { data: updatedOrder } = await supabase
        .from('projects')
        .select(`
          id, title, description, status, share_token, created_by, created_at, updated_at,
          project_members (
            user_id,
            profiles (id, full_name, role, company_name)
          ),
          project_documents (
            id, project_id, uploaded_by, title, file_url, category, file_type, created_at
          ),
          dispatches (
            id, project_id, status, driver_name, driver_phone, vehicle_no, expected_delivery_date, actual_delivery_date, tracking_notes, created_at
          )
        `)
        .eq('id', projectId)
        .single()

      if (updatedOrder) {
        setSelectedOrderDetails(updatedOrder)
      }

      await refreshProjects()
    } catch (err: any) {
      console.error('Assign technician error:', JSON.stringify(err))
      setErrorMsg(supabaseErrMsg(err, 'Failed to assign technician.'))
    }
  }

  // Handle removing a technician from a project
  const handleRemoveTechnician = async (projectId: string, techId: string) => {
    setErrorMsg('')
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', techId)

      if (error) throw error

      // Update selectedOrderDetails locally
      const { data: updatedOrder } = await supabase
        .from('projects')
        .select(`
          id, title, description, status, share_token, created_by, created_at, updated_at,
          project_members (
            user_id,
            profiles (id, full_name, role, company_name)
          ),
          project_documents (
            id, project_id, uploaded_by, title, file_url, category, file_type, created_at
          ),
          dispatches (
            id, project_id, status, driver_name, driver_phone, vehicle_no, expected_delivery_date, actual_delivery_date, tracking_notes, created_at
          )
        `)
        .eq('id', projectId)
        .single()

      if (updatedOrder) {
        setSelectedOrderDetails(updatedOrder)
      }

      await refreshProjects()
    } catch (err: any) {
      console.error('Remove technician error:', JSON.stringify(err))
      setErrorMsg(supabaseErrMsg(err, 'Failed to remove technician.'))
    }
  }

  // Fetch orders from Supabase (aligned with user database profile permissions)
  const refreshProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        status,
        share_token,
        created_by,
        created_at,
        updated_at,
        project_members (
          user_id,
          profiles (
            id,
            full_name,
            role,
            company_name
          )
        ),
        project_documents (
          id,
          project_id,
          uploaded_by,
          title,
          file_url,
          category,
          file_type,
          created_at
        ),
        dispatches (
          id,
          project_id,
          status,
          driver_name,
          driver_phone,
          vehicle_no,
          expected_delivery_date,
          actual_delivery_date,
          tracking_notes,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data)
      // Auto select first order for chat if current selection is invalid
      if (data.length > 0 && (!activeOrderIdForChat || !data.some(o => o.id === activeOrderIdForChat))) {
        setActiveOrderIdForChat(data[0].id)
      }
    }
  }

  // Manufacturer order claiming logic via unique code
  const handleClaimOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimCode.trim()) return

    setLoading(true)
    setClaimError('')
    setClaimSuccess('')

    try {
      const formattedCode = claimCode.trim().toUpperCase()
      if (!formattedCode.startsWith('YESHA-')) {
        setClaimError('Invalid code format. Codes start with YESHA-')
        return
      }

      const orderSnippet = formattedCode.replace('YESHA-', '').toUpperCase()
      if (orderSnippet.length < 4) {
        setClaimError('Code must contain at least 4 characters.')
        return
      }

      // Fetch all projects using the public select policy to find the match
      const { data: matchedProjects, error: selectError } = await supabase
        .from('projects')
        .select('id, title')
      
      if (selectError) throw selectError

      const matched = matchedProjects?.find(p => p.id.replace(/-/g, '').slice(0, 6).toUpperCase() === orderSnippet)

      if (!matched) {
        setClaimError('Order not found or incorrect code.')
        return
      }

      // Check if already a member (may return null if SELECT RLS still uses auth.uid)
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', matched.id)
        .eq('user_id', profile.id)
        .maybeSingle()

      if (existingMember) {
        setClaimSuccess(`You already have access to: "${matched.title}"!`)
        setClaimCode('')
        return
      }

      // Use upsert so duplicate entries are silently ignored (handles the case
      // where existingMember check returns null but row already exists in DB)
      const { error: insertError } = await supabase
        .from('project_members')
        .upsert([{ project_id: matched.id, user_id: profile.id }], {
          onConflict: 'project_id,user_id',
          ignoreDuplicates: true
        })

      if (insertError) throw insertError

      // Log action (ignore errors here so linking still succeeds)
      await supabase.from('activity_logs').insert([
        {
          project_id: matched.id,
          user_id: profile.id,
          action: 'Order Claimed',
          details: { code: formattedCode }
        }
      ])

      setClaimSuccess(`Successfully linked to order: "${matched.title}"!`)
      setClaimCode('')
      await refreshProjects()
    } catch (err: any) {
      // 23505 = duplicate key → the user is already a member (SELECT policy blocked the check)
      if (err?.code === '23505') {
        setClaimSuccess(`You already have access to this order!`)
        setClaimCode('')
        await refreshProjects()
        return
      }
      console.error('Claim order error:', JSON.stringify(err))
      setClaimError(supabaseErrMsg(err, 'Failed to link order.'))
    } finally {
      setLoading(false)
    }
  }

  // Handle technician claiming an order via unique code
  // Only allows access if order status is 'Installation Scheduled' or 'Installation Completed'
  const handleTechClaimOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTechClaimError('')
    setTechClaimSuccess('')

    try {
      const formattedCode = techClaimCode.trim().toUpperCase()
      if (!formattedCode.startsWith('YESHA-')) {
        setTechClaimError('Invalid code format. Codes start with YESHA-')
        return
      }

      const orderSnippet = formattedCode.replace('YESHA-', '').toUpperCase()
      if (orderSnippet.length < 4) {
        setTechClaimError('Code must contain at least 4 characters.')
        return
      }

      // Find the matching project
      const { data: matchedProjects, error: selectError } = await supabase
        .from('projects')
        .select('id, title, status')

      if (selectError) throw selectError

      const matched = matchedProjects?.find(
        p => p.id.replace(/-/g, '').slice(0, 6).toUpperCase() === orderSnippet
      )

      if (!matched) {
        setTechClaimError('Order not found or incorrect code.')
        return
      }

      // ─── GATE: Only allow access if Installation is scheduled ───
      if (!installationStatuses.includes(matched.status)) {
        setTechClaimError(
          `Access denied. This order is currently "${matched.status}". ` +
          `Technician access is only granted once the order is scheduled for installation.`
        )
        return
      }

      // Upsert membership (silently handles duplicate)
      const { error: insertError } = await supabase
        .from('project_members')
        .upsert([{ project_id: matched.id, user_id: profile.id }], {
          onConflict: 'project_id,user_id',
          ignoreDuplicates: true
        })

      if (insertError) throw insertError

      // Log action
      await supabase.from('activity_logs').insert([
        {
          project_id: matched.id,
          user_id: profile.id,
          action: 'Technician Order Access',
          details: { code: formattedCode }
        }
      ])

      setTechClaimSuccess(`Access granted to order: "${matched.title}". It will now appear in your installation list.`)
      setTechClaimCode('')
      await refreshProjects()
    } catch (err: any) {
      if (err?.code === '23505') {
        setTechClaimSuccess('You already have access to this order!')
        setTechClaimCode('')
        await refreshProjects()
        return
      }
      console.error('Tech claim order error:', JSON.stringify(err))
      setTechClaimError(supabaseErrMsg(err, 'Failed to access order.'))
    } finally {
      setLoading(false)
    }
  }

  // Create Order Action (Admin)
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderForm.title.trim()) return

    setLoading(true)
    setErrorMsg('')

    try {
      // Serialize order metadata to the description text
      const orderDesc = buildOrderDescription({
        description: orderForm.description,
        quotationNo: orderForm.quotationNo || 'N/A',
        customerNo: orderForm.customerNo || 'N/A',
        customerName: orderForm.customerName || 'N/A',
        customerAddress: orderForm.customerAddress || 'N/A'
      })

      // 1. Insert Order
      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            title: orderForm.title,
            description: orderDesc,
            created_by: profile.id,
            status: 'Inquiry Received'
          }
        ])
        .select()
        .single()

      if (error) throw error

      // 2. Add Project Members (Admin)
      const membersToInsert = [{ project_id: project.id, user_id: profile.id }]

      // 3. Add Project Member (Manufacturer - if invited)
      if (orderForm.manufacturerId) {
        membersToInsert.push({ project_id: project.id, user_id: orderForm.manufacturerId })
      }

      if (orderForm.technicianId) {
        membersToInsert.push({ project_id: project.id, user_id: orderForm.technicianId })
      }

      await supabase.from('project_members').insert(membersToInsert)

      // 4. Log Action
      await supabase.from('activity_logs').insert([
        {
          project_id: project.id,
          user_id: profile.id,
          action: 'Order Created',
          details: { title: project.title, quotationNo: orderForm.quotationNo }
        }
      ])

      // 5. Initialize Chat Room
      const { data: room } = await supabase
        .from('chat_rooms')
        .insert([{ project_id: project.id, name: 'General Order Chat' }])
        .select()
        .single()

      if (room) {
        // Send initial setup message
        await supabase.from('messages').insert([
          {
            room_id: room.id,
            sender_id: profile.id,
            content: `📦 Order initialized. Quotation: ${orderForm.quotationNo || 'N/A'}.`
          }
        ])
      }

      // Reset Form
      setOrderForm({
        title: '',
        description: '',
        quotationNo: '',
        customerNo: '',
        customerName: '',
        customerAddress: '',
        manufacturerId: '',
        technicianId: ''
      })
      setShowAddOrderModal(false)
      await refreshProjects()
    } catch (err: any) {
      console.error('Create order error:', JSON.stringify(err))
      setErrorMsg(supabaseErrMsg(err, 'Failed to create order. Please apply the RLS fix SQL in Supabase Dashboard.'))
    } finally {
      setLoading(false)
    }
  }

  // Send Message Action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedMessage.trim() || !activeRoomId) return

    const content = typedMessage.trim()
    setTypedMessage('')

    const roleName = profile.role?.replace('_', ' ') || 'member'
    const prefixedContent = `[${roleName}: ${profile.full_name || 'User'}]: ${content}`

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            room_id: activeRoomId,
            sender_id: profile.id,
            content: prefixedContent
          }
        ])

      if (error) throw error
      
      // Instantly refresh
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
        .eq('room_id', activeRoomId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)
        const latestMsg = data[data.length - 1]
        if (latestMsg && socketRef.current) {
          socketRef.current.emit('send-message', latestMsg)
        }
      }
    } catch (err: any) {
      console.error('Failed to send message:', err?.message || err)
    }
  }

  // Delete Message "for everyone" Action
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      // Optimistic state update
      setMessages(prev => prev.filter(m => m.id !== messageId))

      if (socketRef.current) {
        socketRef.current.emit('delete-message', { room_id: activeRoomId, id: messageId })
      }
    } catch (err: any) {
      console.error('Failed to delete message:', err?.message || err)
    }
  }

  // Delete Message "for me" Action (Local Storage)
  const handleDeleteForMe = (messageId: string) => {
    const updated = [...hiddenMessages, messageId]
    setHiddenMessages(updated)
    setDeleteOptionsForId(null)
    localStorage.setItem('yesha_hidden_messages', JSON.stringify(updated))
  }

  // Edit Message Action
  const handleEditMessage = async (messageId: string) => {
    if (!editingContent.trim()) {
      setEditingMessageId(null)
      return
    }

    try {
      const cleanContent = editingContent.replace(/\s*\(edited\)$/, '')
      const finalContent = `${cleanContent}\n*(edited)*`

      const { error } = await supabase
        .from('messages')
        .update({ content: finalContent })
        .eq('id', messageId)

      if (error) throw error

      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: finalContent } : m))
      setEditingMessageId(null)
      setEditingContent('')
      
      // Attempt to broadcast if needed, though simple reload or optimistic state works.
      if (socketRef.current) {
        socketRef.current.emit('edit-message', { room_id: activeRoomId, id: messageId, content: finalContent })
      }
    } catch (err: any) {
      console.error('Failed to edit message:', err?.message || err)
    }
  }

  // Update Status Action
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

      await supabase
        .from('activity_logs')
        .insert([
          {
            project_id: orderId,
            user_id: profile.id,
            action: 'Status Updated',
            details: { status: newStatus }
          }
        ])

      await refreshProjects()
    } catch (err: any) {
      console.error('Update status error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  // Create Dispatch Action
  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId) return

    setLoading(true)
    try {
      const { error: dispatchError } = await supabase
        .from('dispatches')
        .insert([
          {
            project_id: selectedOrderId,
            status: 'In Transit',
            driver_name: newDispatch.driverName,
            driver_phone: newDispatch.driverPhone,
            vehicle_no: newDispatch.vehicleNo,
            expected_delivery_date: newDispatch.expectedDelivery || null,
            tracking_notes: newDispatch.notes
          }
        ])

      if (dispatchError) throw dispatchError

      // Automatically transition order status to Dispatched
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'Dispatched', updated_at: new Date().toISOString() })
        .eq('id', selectedOrderId)

      if (projectError) throw projectError

      await supabase
        .from('activity_logs')
        .insert([
          {
            project_id: selectedOrderId,
            user_id: profile.id,
            action: 'Dispatched',
            details: { driver: newDispatch.driverName, vehicle: newDispatch.vehicleNo }
          }
        ])

      setNewDispatch({
        driverName: '',
        driverPhone: '',
        vehicleNo: '',
        expectedDelivery: '',
        notes: ''
      })
      setShowCreateDispatchModal(false)
      setSelectedOrderId(null)
      await refreshProjects()
    } catch (err: any) {
      console.error('Create dispatch error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  // File Upload Helper (converts to base64 Data URL for persistent SQL storage)
  const handleTechFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setTechUpload(prev => ({ ...prev, imageName: file.name }))
    const reader = new FileReader()
    reader.onloadend = () => {
      setTechUpload(prev => ({ ...prev, imageBase64: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  // Technician Task Completion submission
  const handleTechCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !techUpload.imageBase64) return

    setLoading(true)
    try {
      // 1. Upload photo document
      const { error: docError } = await supabase
        .from('project_documents')
        .insert([
          {
            project_id: selectedOrderId,
            uploaded_by: profile.id,
            title: `Installation Completion Proof (${techUpload.imageName || 'image.jpg'})`,
            file_url: techUpload.imageBase64,
            category: 'Sign-off',
            file_type: 'IMAGE'
          }
        ])

      if (docError) throw docError

      // 2. Transition order status
      const { error: orderError } = await supabase
        .from('projects')
        .update({ status: 'Installation Completed', updated_at: new Date().toISOString() })
        .eq('id', selectedOrderId)

      if (orderError) throw orderError

      // 3. Log Activity
      await supabase
        .from('activity_logs')
        .insert([
          {
            project_id: selectedOrderId,
            user_id: profile.id,
            action: 'Installation Completed',
            details: { notes: techUpload.notes }
          }
        ])

      // Reset states
      setTechUpload({ notes: '', imageName: '', imageBase64: '' })
      setShowTechCompleteModal(false)
      setSelectedOrderId(null)
      await refreshProjects()
    } catch (err: any) {
      console.error('Technician verification failed:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  // Standard File Upload (General)
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !newDoc.title.trim()) return

    setLoading(true)
    try {
      const fileUrl = newDoc.fileUrl.trim() || `https://example.com/docs/${newDoc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
      
      const { error } = await supabase
        .from('project_documents')
        .insert([
          {
            project_id: selectedOrderId,
            uploaded_by: profile.id,
            title: newDoc.title,
            file_url: fileUrl,
            category: newDoc.category,
            file_type: 'PDF'
          }
        ])

      if (error) throw error

      await refreshProjects()
      setNewDoc({ title: '', category: 'Blueprint', fileUrl: '' })
      setShowAddDocModal(false)
      setSelectedOrderId(null)
    } catch (err: any) {
      console.error('Add document error:', err?.message || err)
    } finally {
      setLoading(false)
    }
  }

  // Seed Demo Data helper with custom order metadata
  const handleSeedDemoData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      // Seed orders (renamed projects)
      const sampleOrders = [
        {
          title: 'Modern Office Glazing Fabrication',
          description: buildOrderDescription({
            description: 'Double glazed tempered glass fabrication and fitting.',
            quotationNo: 'QTN-2026-081',
            customerNo: 'CUST-0091',
            customerName: 'Aerospace Tech Solutions',
            customerAddress: 'Building A, Sector 62, Noida, UP'
          }),
          status: 'Manufacturing Started',
          created_by: profile.id
        },
        {
          title: 'Premium Structural Villa Sunroom',
          description: buildOrderDescription({
            description: 'Heavy duty aluminium framing with tinted UV coated laminates.',
            quotationNo: 'QTN-2026-112',
            customerNo: 'CUST-0412',
            customerName: 'Kapil Sharma',
            customerAddress: 'Juhu Tara Rd, Santa Cruz, Mumbai'
          }),
          status: 'Dispatched',
          created_by: profile.id
        }
      ]

      for (const so of sampleOrders) {
        const { data: order, error } = await supabase
          .from('projects')
          .insert([so])
          .select()
          .single()

        if (error) continue

        // Members
        await supabase
          .from('project_members')
          .insert([{ project_id: order.id, user_id: profile.id }])

        // Chat room
        const { data: room } = await supabase
          .from('chat_rooms')
          .insert([{ project_id: order.id, name: 'General Order Chat' }])
          .select()
          .single()

        if (room) {
          await supabase.from('messages').insert([
            {
              room_id: room.id,
              sender_id: profile.id,
              content: '👋 Welcome to the Order Chat! Team members can post updates here.'
            }
          ])
        }
      }

      await refreshProjects()
    } catch (err: any) {
      console.error('Seed demo data error:', err?.message || err)
      setErrorMsg(err.message || 'Failed to seed sample orders.')
    } finally {
      setLoading(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(
    (o) =>
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeOrderDetails = orders.find(o => o.id === activeOrderIdForChat)
  const parsedActiveMeta = activeOrderDetails ? parseOrderDescription(activeOrderDetails.description) : null

  // Manufacturer filter: orders where manufacturer is a member
  const manufacturerOrders = orders.filter(o => {
    if (profile?.role === 'manufacturer') {
      return o.project_members?.some((m: any) => m.user_id === profile.id)
    }
    return true
  })

  // Technician filter: orders where technician is a member AND status is Installation Scheduled or later
  const installationStatuses = ['Installation Scheduled', 'Installation Completed']
  const techOrders = orders.filter(o => {
    if (profile?.role === 'technician') {
      const isMember = o.project_members?.some((m: any) => m.user_id === profile.id)
      const isInstallationStage = installationStatuses.includes(o.status)
      return isMember && isInstallationStage
    }
    return true
  })

  // =========================================
  // 1. STRICT CUSTOMER VIEW (CHAT ONLY)
  // =========================================
  if (profile?.role === 'customer') {
    return (
      <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
        {/* Top Navbar */}
        <header className="h-20 min-h-20 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 sm:hidden dark:border-zinc-700 dark:hover:bg-zinc-800 mr-1"
            >
              <Menu className="size-4" />
            </button>
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Yesha Enterprises</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize border bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900">
              Customer Mode
            </span>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </header>

        {/* Messaging Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Backdrop for mobile sidebar */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-zinc-950/40 backdrop-blur-xs sm:hidden"
            />
          )}

          {/* Orders sidebar (if multiple orders exist) */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-85 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 sm:relative sm:translate-x-0 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
            } flex flex-col`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wider">Your Active Orders</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 sm:hidden dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {orders.length === 0 ? (
                <p className="text-xs text-zinc-500 italic p-4 text-center">No orders found.</p>
              ) : (
                orders.map((o) => {
                  const meta = parseOrderDescription(o.description)
                  return (
                    <button
                      key={o.id}
                      onClick={() => {
                        setActiveOrderIdForChat(o.id)
                        setClaimError('')
                        setClaimSuccess('')
                        setIsSidebarOpen(false)
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        activeOrderIdForChat === o.id
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-650 dark:text-zinc-400'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{o.title}</p>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className="text-zinc-400">Quote: {meta.quotationNo}</span>
                        <span className={`px-1.5 py-0.2 border rounded text-[9px] font-medium ${getStatusColor(o.status)}`}>
                          {o.status === 'Order Confirmed' ? 'Order Received' : o.status === 'Manufacturing Started' ? 'Sent for Production' : o.status === 'Manufacturing Completed' ? 'Ready' : o.status}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="p-3 border-t bg-zinc-50/50 dark:bg-zinc-900/40">
              <Button
                variant="outline"
                size="xs"
                className="w-full text-[10px] gap-1 px-2 border-zinc-200 dark:border-zinc-800"
                onClick={() => {
                  setActiveOrderIdForChat(null)
                  setClaimError('')
                  setClaimSuccess('')
                  setIsSidebarOpen(false)
                }}
              >
                <Plus className="size-3" /> Link Another Order
              </Button>
            </div>
          </aside>

          {/* Active Chat pane */}
          <main className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {activeOrderDetails ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat header */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">{activeOrderDetails.title}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                      Quote: <strong className="text-zinc-700 dark:text-zinc-300">{parsedActiveMeta?.quotationNo}</strong> | Status: <span className="font-semibold text-indigo-650 dark:text-indigo-400">{activeOrderDetails.status === 'Order Confirmed' ? 'Order Received' : activeOrderDetails.status === 'Manufacturing Started' ? 'Sent for Production' : activeOrderDetails.status === 'Manufacturing Completed' ? 'Ready' : activeOrderDetails.status}</span>
                      <button
                        onClick={() => setSelectedOrderDetails(activeOrderDetails)}
                        className="text-violet-600 hover:text-violet-750 dark:text-violet-400 dark:hover:text-violet-350 text-[10px] font-bold underline ml-2"
                      >
                        View Details
                      </button>
                    </p>
                  </div>

                  {/* Icon Based Tracking Checklist for Customer */}
                  <div className="flex items-center gap-3 p-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-750/80">
                    {[
                      { label: 'Order Received', achieved: statuses.indexOf(activeOrderDetails.status) >= statuses.indexOf('Order Confirmed'), icon: CheckCircle },
                      { label: 'Sent for Production', achieved: statuses.indexOf(activeOrderDetails.status) >= statuses.indexOf('Manufacturing Started'), icon: Building },
                      { label: 'Ready', achieved: statuses.indexOf(activeOrderDetails.status) >= statuses.indexOf('Manufacturing Completed'), icon: Layers },
                      { label: 'Dispatched', achieved: statuses.indexOf(activeOrderDetails.status) >= statuses.indexOf('Dispatched'), icon: Truck },
                      { label: 'Installed', achieved: activeOrderDetails.status === 'Installation Completed', icon: ShieldCheck }
                    ].map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div key={idx} className="flex flex-col items-center gap-0.5">
                          <div className={`p-1 rounded-lg border transition-all ${
                            item.achieved 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400' 
                              : 'bg-zinc-100 border-zinc-200 text-zinc-350 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-650'
                          }`}>
                            <Icon className="size-3.5" />
                          </div>
                          <span className={`text-[8px] font-bold ${item.achieved ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>
                            {item.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] dark:bg-zinc-950/90">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                      <MessageSquare className="size-10 text-zinc-300 mb-2" />
                      <p className="text-sm font-medium">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const parsed = parseMessageContent(m.content, m.sender_id, m.profiles)
                      const isOwnMessage = getIsOwnMessage(m, 'customer', profile.id)
                      const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                      return (
                        <div
                          key={m.id}
                          className={`flex items-start w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                            {/* Sender nickname header */}
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                              <span className={isOwnMessage ? 'text-violet-650 dark:text-violet-400' : 'text-zinc-650 dark:text-zinc-300'}>
                                {parsed.senderName}
                              </span>
                              <span className="px-1 text-[7px] bg-zinc-200/50 dark:bg-zinc-800 rounded uppercase">
                                {parsed.roleLabel}
                              </span>
                            </div>

                            <div className="relative group/bubble flex items-end gap-2">
                              {/* Clean Premium Bubble */}
                              <div className={`rounded-2xl px-3.5 py-2 text-xs shadow-xs relative leading-normal ${
                                isOwnMessage
                                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-violet-500/10 min-w-[80px]'
                                  : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-150 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-855 min-w-[120px]'
                              }`}>
                                <p className="whitespace-pre-line break-words">{parsed.cleanContent}</p>
                                <span className={`block text-[8px] text-right mt-1.5 font-medium ${isOwnMessage ? 'text-violet-200' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                  {timeStr}
                                </span>
                              </div>

                              {/* Delete message action (Own message or Admin role) */}
                              {(isOwnMessage || profile?.role === 'super_admin') && (
                                <button
                                  onClick={() => handleDeleteMessage(m.id)}
                                  className="opacity-0 group-hover/bubble:opacity-100 p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-650 transition-opacity shrink-0 self-center"
                                  title="Delete for everyone"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input panel */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                  <Input
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-50/50 focus:bg-white border-zinc-200 dark:border-zinc-800 rounded-full pl-4"
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0 bg-violet-600 hover:bg-violet-750 text-white">
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
                <Card className="w-full max-w-md border-zinc-200/50 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto size-12 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 flex items-center justify-center mb-3">
                      <Sparkles className="size-6" />
                    </div>
                    <CardTitle className="text-base font-bold">Activate Your Order Chat</CardTitle>
                    <CardDescription className="text-xs">
                      Enter the unique order verification code (e.g. YESHA-A1B2C3) provided by the administrator to link this order to your profile and start chatting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 text-center">
                    <form onSubmit={handleClaimOrder} className="flex gap-2 justify-center">
                      <Input
                        value={claimCode}
                        onChange={(e) => setClaimCode(e.target.value)}
                        placeholder="YESHA-XXXXXX"
                        className="h-9 text-xs border-zinc-200 bg-white dark:bg-zinc-850 dark:border-zinc-750 focus-visible:ring-violet-500 max-w-[200px]"
                      />
                      <Button type="submit" disabled={loading} size="sm" className="h-9 text-xs bg-violet-600 text-white hover:bg-violet-700">
                        {loading ? 'Activating...' : 'Activate Access'}
                      </Button>
                    </form>
                    {claimError && <p className="text-[10px] text-red-500 mt-2 font-semibold flex items-center justify-center gap-1"><AlertCircle className="size-3" /> {claimError}</p>}
                    {claimSuccess && <p className="text-[10px] text-emerald-600 mt-2 font-semibold flex items-center justify-center gap-1"><CheckCircle className="size-3" /> {claimSuccess}</p>}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>

        {/* Floating Sandbox Widget */}
        <div className="fixed bottom-4 right-4 z-50">
          <AnimatePresence>
            {showSandbox ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 w-72 space-y-4 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Wrench className="size-3 text-violet-500" /> Dev Sandbox
                  </span>
                  <button
                    onClick={() => setShowSandbox(false)}
                    className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-500 dark:text-zinc-400"
                  >
                    <X className="size-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 font-semibold mb-1">Switch simulated role:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'super_admin', label: 'Admin', color: 'border-amber-400' },
                      { id: 'customer', label: 'Customer', color: 'border-blue-400' },
                      { id: 'manufacturer', label: 'Manufacturer', color: 'border-emerald-400' },
                      { id: 'technician', label: 'Technician', color: 'border-purple-400' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSwitch(r.id)}
                        disabled={loading}
                        className={`px-2 py-1 border text-[11px] rounded-lg font-semibold transition-all ${
                          simulatedRole === r.id
                            ? `bg-zinc-950 dark:bg-zinc-800 text-white ${r.color} border-2`
                            : 'bg-zinc-50/50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {loading && simulatedRole !== r.id ? '...' : r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Button
                    onClick={handleSeedDemoData}
                    disabled={loading}
                    size="xs"
                    className="w-full justify-center gap-1.5"
                  >
                    <RefreshCw className="size-3" /> Seed Demo Data
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={() => setShowSandbox(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg text-xs"
              >
                <Wrench className="size-3.5" /> Dev Sandbox
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // =========================================
  // 2. STANDARD FULL SIDEBAR LAYOUT (ADMIN, MFR, TECH)
  // =========================================
  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center">
              <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Yesha Enterprises</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 md:hidden dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', name: 'Overview', icon: LayoutDashboard, visible: true },
              { id: 'projects', name: 'Orders', icon: FolderKanban, visible: true },
              { id: 'documents', name: 'Documents', icon: FileText, visible: profile?.role !== 'manufacturer' && profile?.role !== 'technician' },
              { id: 'chat', name: 'Team Chat', icon: MessageSquare, visible: profile?.role !== 'technician' },
              { id: 'settings', name: 'Settings', icon: Settings, visible: profile?.role === 'super_admin' }
            ].map((item) => {
              if (!item.visible) return null
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-50 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-50'
                  }`}
                >
                  <Icon
                    className={`size-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-violet-400' : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Bottom user card */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 flex items-center justify-center font-bold">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {profile?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <form action={logout}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full justify-center gap-2 text-zinc-600 dark:text-zinc-400"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 min-h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 md:hidden dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Menu className="size-5" />
            </button>
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 border-zinc-200 dark:border-zinc-700 rounded-full bg-zinc-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                profile?.role === 'super_admin'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300'
                  : profile?.role === 'manufacturer'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300'
              }`}
            >
              {profile?.role?.replace('_', ' ')}
            </span>

            {profile?.role === 'super_admin' && (
              <Button
                onClick={() => setShowAddOrderModal(true)}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md border-0"
              >
                <Plus className="size-4" />
                New Order
              </Button>
            )}
          </div>
        </header>

        {/* Content wrapper */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 2.1 OVERVIEW SUB-VIEW */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-900 dark:via-indigo-950 dark:to-blue-950 text-white shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-2 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-md">
                      <Sparkles className="size-3 text-amber-300" /> Active Tracking
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight">
                      {profile?.role === 'super_admin' ? 'Admin Control Center' : 'Manufacturer Workspace'}
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-100 font-light leading-relaxed">
                      {profile?.role === 'super_admin'
                        ? 'Initialize new orders, invite partners, dispatch drivers, and monitor installation milestones.'
                        : 'Review assigned fabrication orders, update production queue stages, and consult with the project team.'}
                    </p>
                  </div>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Orders', value: orders.length, icon: FolderKanban, color: 'text-blue-500' },
                    { title: 'In Fabrication', value: orders.filter(o => o.status === 'Manufacturing Started' || o.status === 'Manufacturing Completed').length, icon: Building, color: 'text-amber-500' },
                    { title: 'In Logistics', value: orders.filter(o => o.status === 'Dispatched' || o.status === 'In Transit').length, icon: Truck, color: 'text-orange-500' },
                    { title: 'Installed', value: orders.filter(o => o.status === 'Installation Completed').length, icon: CheckCircle, color: 'text-emerald-500' }
                  ].map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                      <Card key={idx} className="border-zinc-200/50 dark:border-zinc-800/50">
                        <CardHeader className="flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                            {stat.title}
                          </CardTitle>
                          <Icon className={`size-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Orders quick overview */}
                  <Card className="lg:col-span-2 border-zinc-200/50 dark:border-zinc-800/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
                        <CardDescription>Track state and quotation numbers</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('projects')}>
                        View all <ChevronRight className="size-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {filteredOrders.length === 0 ? (
                        <p className="py-8 text-center text-zinc-500 italic">No orders tracked yet.</p>
                      ) : (
                        filteredOrders.slice(0, 3).map((order) => {
                          const meta = parseOrderDescription(order.description)
                          return (
                            <div key={order.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                              <div className="min-w-0 pr-4">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                  {order.title}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  Quote: {meta.quotationNo} | Client: {meta.customerName}
                                </p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(order.status)}`}>
                                {order.status === 'Order Confirmed' ? 'Order Received' : order.status === 'Manufacturing Started' ? 'Sent for Production' : order.status === 'Manufacturing Completed' ? 'Ready' : order.status}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </CardContent>
                  </Card>

                  {/* Operational instructions */}
                  <Card className="border-zinc-200/50 dark:border-zinc-800/50">
                    <CardHeader>
                      <CardTitle className="text-base font-bold">Role Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-3 text-zinc-600 dark:text-zinc-400">
                      <p>Currently simulated role: <strong className="text-zinc-950 dark:text-white capitalize">{profile?.role?.replace('_', ' ')}</strong></p>
                      {profile?.role === 'super_admin' ? (
                        <p>As Admin, you can create new orders, invite manufacturers to chats, update order status, allocate dispatch tracking info, and view completion image uploads.</p>
                      ) : profile?.role === 'manufacturer' ? (
                        <p>As Manufacturer, you can see chats for orders you are invited to and participate in discussions. Update production status when manufacturing starts/completes.</p>
                      ) : (
                        <p>As Technician, you can mark assigned installations as completed by uploading a verification photo of the completion page.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* 2.2 ORDERS SUB-VIEW */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-heading">YESHA Orders</h2>
                    <p className="text-sm text-zinc-500">Monitor fabrication queues, customer specifications, and shipping details.</p>
                  </div>
                  {profile?.role === 'super_admin' && (
                    <Button onClick={() => setShowAddOrderModal(true)} size="sm" className="gap-1.5 self-start">
                      <Plus className="size-4" /> New Order
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Technician: claim order via code (only when Installation Scheduled) */}
                  {profile?.role === 'technician' && (
                    <Card className="border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-zinc-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <Wrench className="size-4 text-purple-500" /> Access Installation Order
                        </CardTitle>
                        <CardDescription>
                          Enter the unique order verification code to access your assigned installation.
                          <span className="block mt-0.5 text-purple-600 dark:text-purple-400 font-medium">
                            ⚠ Access is only granted once the admin has set the order status to &quot;Installation Scheduled&quot;.
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <form onSubmit={handleTechClaimOrder} className="flex gap-2 max-w-md">
                          <Input
                            value={techClaimCode}
                            onChange={(e) => setTechClaimCode(e.target.value)}
                            placeholder="e.g. YESHA-A1B2C3"
                            className="h-8 text-xs border-purple-200 bg-white dark:bg-zinc-850 focus:ring-purple-500"
                          />
                          <Button type="submit" disabled={loading} size="sm" className="h-8 text-xs bg-purple-600 text-white hover:bg-purple-700 border-0">
                            {loading ? 'Checking...' : 'Access Order'}
                          </Button>
                        </form>
                        {techClaimError && (
                          <p className="text-[10px] text-red-500 mt-1.5 font-semibold flex items-center gap-1">
                            <AlertCircle className="size-3 shrink-0" /> {techClaimError}
                          </p>
                        )}
                        {techClaimSuccess && (
                          <p className="text-[10px] text-emerald-600 mt-1.5 font-semibold flex items-center gap-1">
                            <CheckCircle className="size-3 shrink-0" /> {techClaimSuccess}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {profile?.role === 'manufacturer' && (
                    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5"><Layers className="size-4 text-violet-500" /> Activate Order by Verification Code</CardTitle>
                        <CardDescription>Enter the unique order verification code provided by the administrator to access and manage the order chat and production statuses.</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <form onSubmit={handleClaimOrder} className="flex gap-2 max-w-md">
                          <Input
                            value={claimCode}
                            onChange={(e) => setClaimCode(e.target.value)}
                            placeholder="e.g. YESHA-A1B2C3"
                            className="h-8 text-xs border-zinc-200 bg-white dark:bg-zinc-850"
                          />
                          <Button type="submit" disabled={loading} size="sm" className="h-8 text-xs bg-violet-600 text-white hover:bg-violet-750">
                            {loading ? 'Activating...' : 'Activate Access'}
                          </Button>
                        </form>
                        {claimError && <p className="text-[10px] text-red-500 mt-1.5 font-semibold flex items-center gap-1"><AlertCircle className="size-3" /> {claimError}</p>}
                        {claimSuccess && <p className="text-[10px] text-emerald-600 mt-1.5 font-semibold flex items-center gap-1"><CheckCircle className="size-3" /> {claimSuccess}</p>}
                      </CardContent>
                    </Card>
                  )}

                  {(() => {
                    const displayOrders = profile?.role === 'technician' ? techOrders : manufacturerOrders
                    const emptyMessage = profile?.role === 'technician'
                      ? 'No installation orders yet. Enter your order code above once the admin has scheduled your installation.'
                      : 'If you just switched roles, click "Seed Demo Data" in the sandbox overlay.'
                    const emptyTitle = profile?.role === 'technician' ? 'No Installations Scheduled' : 'No Orders Found'

                    return displayOrders.length === 0 ? (
                      <Card className="p-12 text-center text-zinc-500 border-dashed">
                        <Wrench className={`size-10 mx-auto mb-3 ${profile?.role === 'technician' ? 'text-purple-300' : 'text-zinc-400'}`} />
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{emptyTitle}</h3>
                        <p className="text-sm mt-1 max-w-xs mx-auto">{emptyMessage}</p>
                      </Card>
                    ) : (
                      displayOrders.map((order) => {
                      const meta = parseOrderDescription(order.description)
                      const dispatch = order.dispatches?.[0]
                      
                      const isApproved = statuses.indexOf(order.status) >= statuses.indexOf('Order Confirmed')
                      const isFabricating = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Started')
                      const isFabricated = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Completed')
                      const isShipped = statuses.indexOf(order.status) >= statuses.indexOf('Dispatched')
                      const isReady = order.status === 'Installation Completed'
                      const uniqueCode = `YESHA-${order.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`

                      return (
                        <Card
                          key={order.id}
                          onClick={() => setSelectedOrderDetails(order)}
                          className="border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden cursor-pointer hover:bg-zinc-50/40 dark:hover:bg-zinc-900/40 transition-colors"
                        >
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-violet-600" />
                          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Order detail */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-heading text-sm font-extrabold text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-750/50">
                                  #{meta.quotationNo}
                                </span>
                                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                  {order.title}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                                <span>Customer: <strong className="text-zinc-700 dark:text-zinc-300">{meta.customerName}</strong> ({meta.customerNo})</span>
                                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                                <span>Order Code: <strong className="text-violet-600 dark:text-violet-400 font-mono font-bold">{uniqueCode}</strong></span>
                              </div>
                            </div>

                            {/* Condition Icons */}
                            <div className="flex items-center gap-4 p-2 bg-zinc-50/50 dark:bg-zinc-900/60 rounded-xl border border-zinc-150 dark:border-zinc-800/80 max-w-max" onClick={(e) => e.stopPropagation()}>
                              {[
                                { label: 'Order Received', achieved: isApproved, icon: CheckCircle, desc: 'Order Confirmed' },
                                { label: 'Sent for Production', achieved: isFabricating, icon: Building, desc: 'In Production' },
                                { label: 'Ready', achieved: isFabricated, icon: Layers, desc: 'Fabrication Completed' },
                                { label: 'Dispatched', achieved: isShipped, icon: Truck, desc: 'Logistics Dispatched' },
                                { label: 'Installed', achieved: isReady, icon: ShieldCheck, desc: 'Installation Complete' }
                              ].map((item, idx) => {
                                const Icon = item.icon
                                return (
                                  <div key={idx} className="flex flex-col items-center gap-0.5 cursor-default group/tooltip relative" title={item.desc}>
                                    <div className={`p-1.5 rounded-lg border transition-all ${
                                      item.achieved 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 shadow-xs' 
                                        : 'bg-zinc-100/50 border-zinc-200 text-zinc-350 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-650'
                                    }`}>
                                      <Icon className="size-3.5" />
                                    </div>
                                    <span className="text-[8px] font-semibold text-zinc-400 group-hover/tooltip:text-zinc-700 dark:group-hover/tooltip:text-zinc-200">
                                      {item.label}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Status and Action Buttons */}
                            <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap" onClick={(e) => e.stopPropagation()}>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${
                                isReady
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                              }`}>
                                {isReady ? 'Ready' : 'In Progress'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {/* Admin actions */}
                                {profile?.role === 'super_admin' && (
                                  <div className="flex items-center gap-1.5">
                                    <select
                                      value={order.status}
                                      onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}
                                      className="h-7 px-1.5 border rounded-lg text-[10px] bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                                    >
                                      {statuses.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                      ))}
                                    </select>

                                    {!dispatch && (
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedOrderId(order.id)
                                          setShowCreateDispatchModal(true)
                                        }}
                                        size="xs"
                                        variant="outline"
                                        className="h-7 text-[10px] gap-1 px-2 border-zinc-200"
                                      >
                                        <Truck className="size-3" /> Ship
                                      </Button>
                                    )}
                                    
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedOrderId(order.id)
                                        setShowAddDocModal(true)
                                      }}
                                      size="xs"
                                      variant="outline"
                                      className="h-7 text-[10px] gap-1 px-2 border-zinc-200"
                                    >
                                      <Plus className="size-3" /> Doc
                                    </Button>

                                    {order.share_token && (
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCopyInviteLink(order)
                                        }}
                                        size="xs"
                                        variant="outline"
                                        className="h-7 text-[10px] gap-1 px-2 border-zinc-200"
                                      >
                                        {copiedOrderId === order.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                        Invite
                                      </Button>
                                    )}
                                  </div>
                                )}

                                  {/* Manufacturer actions */}
                                  {profile?.role === 'manufacturer' && (
                                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        disabled={order.status !== 'Quotation Sent' && order.status !== 'Inquiry Received'}
                                        onClick={() => handleUpdateStatus(order.id, 'Order Confirmed')}
                                        variant="outline"
                                        size="xs"
                                        className="h-7 text-[10px]"
                                      >
                                        Order Received
                                      </Button>
                                      <Button
                                        disabled={order.status !== 'Order Confirmed'}
                                        onClick={() => handleUpdateStatus(order.id, 'Manufacturing Started')}
                                        variant="outline"
                                        size="xs"
                                        className="h-7 text-[10px]"
                                      >
                                        Sent for Production
                                      </Button>
                                      <Button
                                        disabled={order.status !== 'Manufacturing Started'}
                                        onClick={() => handleUpdateStatus(order.id, 'Manufacturing Completed')}
                                        variant="outline"
                                        size="xs"
                                        className="h-7 text-[10px]"
                                      >
                                        Ready
                                      </Button>
                                      <Button
                                        disabled={order.status !== 'Manufacturing Completed'}
                                        onClick={() => handleUpdateStatus(order.id, 'Dispatched')}
                                        size="xs"
                                        className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                      >
                                        Dispatched
                                      </Button>
                                    </div>
                                  )}

                                {/* Technician actions */}
                                {profile?.role === 'technician' && (
                                  <div className="flex gap-1">
                                    <Button
                                      disabled={order.status !== 'Delivered'}
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'Installation Scheduled'); }}
                                      variant="outline"
                                      size="xs"
                                      className="h-7 text-[10px]"
                                    >
                                      Schedule
                                    </Button>
                                    <Button
                                      disabled={order.status !== 'Installation Scheduled'}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedOrderId(order.id)
                                        setShowTechCompleteModal(true)
                                      }}
                                      size="xs"
                                      className="h-7 text-[10px] bg-purple-600 hover:bg-purple-700 text-white border-0"
                                    >
                                      Complete
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                    )
                  })()}
                </div>
              </motion.div>
            )}

            {/* 2.3 DOCUMENTS SUB-VIEW */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-heading">Document Library</h2>
                  <p className="text-sm text-zinc-500">Access design files, quotations and safety logs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Blueprint', 'Quotation', 'Sign-off'].map((cat) => {
                    const catDocs = orders.flatMap(o => 
                      (o.project_documents || []).filter((d: any) => d.category.toLowerCase() === cat.toLowerCase()).map((d: any) => ({ ...d, orderTitle: o.title }))
                    )

                    return (
                      <Card key={cat} className="border-zinc-200/50 dark:border-zinc-800/50">
                        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/40 pb-2">
                          <CardTitle className="text-sm font-bold flex items-center justify-between">
                            <span>{cat}s</span>
                            <span className="text-xs bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{catDocs.length}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          {catDocs.length === 0 ? (
                            <p className="text-xs text-zinc-500 italic py-4 text-center">Empty</p>
                          ) : (
                            catDocs.map((doc: any) => (
                              <div key={doc.id} className="p-2 border rounded-lg bg-white dark:bg-zinc-800 text-xs flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                  <p className="font-semibold truncate">{doc.title}</p>
                                  <p className="text-[9px] text-zinc-400 truncate">Order: {doc.orderTitle}</p>
                                </div>
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-zinc-50 border shrink-0 text-zinc-600">
                                  <FileDown className="size-3.5" />
                                </a>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* 2.4 TEAM CHAT SUB-VIEW */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-[calc(100vh-12rem)] flex flex-col"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold font-heading">Order Chats</h2>
                  <p className="text-sm text-zinc-500 font-light">Collaborate on order details with invited manufacturers and field teams.</p>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                  {/* Channel List (Horizontal on mobile, vertical on desktop) */}
                  <div className="sm:w-64 border-b sm:border-b-0 sm:border-r flex flex-col shrink-0">
                    <div className="p-2 sm:p-3 border-b sm:block hidden">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Active Channels</span>
                    </div>
                    <div className="flex sm:flex-col flex-row overflow-x-auto sm:overflow-y-auto p-2 gap-2 sm:gap-0 sm:space-y-1 no-scrollbar">
                      {(profile?.role === 'technician' ? techOrders : manufacturerOrders).map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setActiveOrderIdForChat(o.id)}
                          className={`shrink-0 sm:w-full text-left px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs transition-all truncate max-w-[150px] sm:max-w-none border sm:border-transparent ${
                            activeOrderIdForChat === o.id
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border-zinc-200 dark:border-zinc-700'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border-transparent'
                          }`}
                        >
                          # {o.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right chat panel */}
                  <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
                    {activeOrderDetails ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-3 border-b bg-white dark:bg-zinc-900 flex justify-between items-center shadow-xs shrink-0">
                          <div className="truncate pr-2">
                            <h4 className="font-bold text-sm truncate"># {activeOrderDetails.title}</h4>
                            <p className="text-[10px] text-zinc-400 truncate">Quotation No: {parsedActiveMeta?.quotationNo}</p>
                          </div>
                          {activeOrderDetails.share_token && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyInviteLink(activeOrderDetails)}
                              className="h-7 text-[10px] sm:text-xs shrink-0"
                            >
                              {copiedOrderId === activeOrderDetails.id ? (
                                <><Check className="size-3 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="size-3 mr-1" /> Invite Customer</>
                              )}
                            </Button>
                          )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] dark:bg-zinc-950/90">
                          {messages.map((m) => {
                            if (hiddenMessages.includes(m.id)) return null

                            const parsed = parseMessageContent(m.content, m.sender_id, m.profiles)
                            const isOwn = getIsOwnMessage(m, profile.role, profile.id)
                            const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            
                            // Check if within 5 mins
                            const isEditable = isOwn && (new Date().getTime() - new Date(m.created_at).getTime()) < 5 * 60 * 1000
                            const isEditing = editingMessageId === m.id

                            return (
                              <div
                                key={m.id}
                                className={`flex items-start w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex flex-col max-w-[85%] ${isOwn ? 'items-end' : 'items-start'}`}>
                                  {/* Sender nickname header */}
                                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                                    <span className={isOwn ? 'text-violet-650 dark:text-violet-400' : 'text-zinc-650 dark:text-zinc-300'}>
                                      {parsed.senderName}
                                    </span>
                                    <span className="px-1 text-[7px] bg-zinc-200/50 dark:bg-zinc-800 rounded uppercase">
                                      {parsed.roleLabel}
                                    </span>
                                  </div>

                                  <div className={`relative group/bubble flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Clean Premium Bubble */}
                                    <div className={`rounded-2xl px-3.5 py-2 text-xs shadow-xs relative leading-normal ${
                                      isOwn
                                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-violet-500/10 min-w-[80px]'
                                        : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-150 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-855 min-w-[120px]'
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
                                    {!isEditing && (
                                      <div className={`transition-all duration-200 flex items-center gap-1 ${deleteOptionsForId === m.id ? 'opacity-100 scale-100' : 'opacity-60 sm:opacity-0 sm:group-hover/bubble:opacity-100 focus-within:opacity-100 scale-95'}`}>
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
                                          <div className="flex gap-1 shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-1 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm" tabIndex={0}>
                                            {isEditable && (
                                              <button
                                                onClick={() => { setEditingMessageId(m.id); setEditingContent(parsed.cleanContent); }}
                                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-violet-600 transition-colors"
                                                title="Edit Message (within 5 mins)"
                                              >
                                                <Edit2 className="size-3.5" />
                                              </button>
                                            )}
                                            {(isOwn || profile?.role === 'super_admin') && (
                                              <button
                                                onClick={() => isOwn ? setDeleteOptionsForId(m.id) : handleDeleteMessage(m.id)}
                                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-650 transition-colors"
                                                title="Delete Message"
                                              >
                                                <Trash2 className="size-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          <div ref={chatBottomRef} />
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-900 border-t flex gap-2">
                          <Input
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            placeholder="Post message to team..."
                            className="flex-1 bg-zinc-50 border-zinc-200 text-xs rounded-full pl-3"
                          />
                          <Button type="submit" size="icon" className="rounded-full bg-violet-600 hover:bg-violet-700">
                            <Send className="size-3.5" />
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic p-6 text-center">Select an order chat channel from the left.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2.5 SETTINGS SUB-VIEW */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-heading">Settings</h2>
                  <p className="text-sm text-zinc-500">Global dashboard settings and adjustments.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-zinc-200/50">
                    <CardHeader>
                      <CardTitle>Profile Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <Label>Full Name</Label>
                        <Input defaultValue={profile?.full_name} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Company Name</Label>
                        <Input defaultValue={profile?.company_name || ''} className="h-8 text-xs" />
                      </div>
                      <Button className="w-full h-8 text-xs">Save Changes</Button>
                    </CardContent>
                  </Card>

                  {profile?.role === 'super_admin' && (
                    <Card className="border-zinc-200/50">
                      <CardHeader>
                        <CardTitle className="text-purple-600 dark:text-purple-400">Create Technician Credentials</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-xs">
                        {techError && <div className="p-2.5 bg-red-50 text-red-650 rounded text-xs">{techError}</div>}
                        {techSuccess && <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded text-xs">{techSuccess}</div>}
                        <div className="space-y-1.5">
                          <Label>Technician Full Name</Label>
                          <Input
                            value={techForm.fullName}
                            onChange={(e) => setTechForm(p => ({ ...p, fullName: e.target.value }))}
                            placeholder="e.g. Ramesh Kumar"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Login Username</Label>
                          <Input
                            value={techForm.username}
                            onChange={(e) => setTechForm(p => ({ ...p, username: e.target.value }))}
                            placeholder="e.g. ramesh01"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Login Password</Label>
                          <Input
                            type="password"
                            value={techForm.password}
                            onChange={(e) => setTechForm(p => ({ ...p, password: e.target.value }))}
                            placeholder="e.g. Pass@123"
                            className="h-8 text-xs"
                          />
                        </div>
                        <Button onClick={handleCreateTechnician} disabled={techLoading} className="w-full h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white border-0">
                          {techLoading ? 'Creating...' : 'Create Technician'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* =========================================
          MODALS & FORM SUBMISSIONS 
      ========================================= */}

      {/* A. Create Order Modal (Admin Only, custom fields + manufacturer invite) */}
      <AnimatePresence>
        {showAddOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-2xl z-10 space-y-4 overflow-y-auto max-h-[90vh]"
            >
              <div>
                <h3 className="text-lg font-bold font-heading">Initialize New Order</h3>
                <p className="text-xs text-zinc-500">Allocate quotations, customer details, and dispatch schedules.</p>
              </div>

              {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded text-xs">{errorMsg}</div>}

              <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="o-title">Order Name / Title</Label>
                    <Input
                      id="o-title"
                      required
                      value={orderForm.title}
                      onChange={(e) => setOrderForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Structural Toughened Glazing"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="o-qtn">Quotation Number</Label>
                    <Input
                      id="o-qtn"
                      required
                      value={orderForm.quotationNo}
                      onChange={(e) => setOrderForm(p => ({ ...p, quotationNo: e.target.value }))}
                      placeholder="e.g. QTN-2026-908"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="o-cust">Customer Number</Label>
                    <Input
                      id="o-cust"
                      required
                      value={orderForm.customerNo}
                      onChange={(e) => setOrderForm(p => ({ ...p, customerNo: e.target.value }))}
                      placeholder="e.g. CUST-8812"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="o-cname">Customer Name</Label>
                    <Input
                      id="o-cname"
                      required
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(p => ({ ...p, customerName: e.target.value }))}
                      placeholder="e.g. Ritesh Malhotra"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="o-caddr">Customer Delivery Address</Label>
                    <textarea
                      id="o-caddr"
                      required
                      value={orderForm.customerAddress}
                      onChange={(e) => setOrderForm(p => ({ ...p, customerAddress: e.target.value }))}
                      rows={2}
                      placeholder="Street address, City, Landmark, Pincode"
                      className="w-full text-sm border rounded-lg p-2.5 bg-transparent border-input focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none text-zinc-900 dark:text-zinc-50 dark:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="o-desc">Technical Specifications / Description</Label>
                    <textarea
                      id="o-desc"
                      value={orderForm.description}
                      onChange={(e) => setOrderForm(p => ({ ...p, description: e.target.value }))}
                      rows={2}
                      placeholder="Details on glass thickness, tints, framing dimensions..."
                      className="w-full text-sm border rounded-lg p-2.5 bg-transparent border-input focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none text-zinc-900 dark:text-zinc-50 dark:border-zinc-700"
                    />
                  </div>


                  <div className="space-y-1.5 col-span-2">
                    <Label htmlFor="o-tech">Assign Technician to Installation</Label>
                    <select
                      id="o-tech"
                      value={orderForm.technicianId}
                      onChange={(e) => setOrderForm(p => ({ ...p, technicianId: e.target.value }))}
                      className="w-full h-8 px-2 border rounded-lg text-xs bg-white dark:bg-zinc-800"
                    >
                      <option value="">-- No Technician Selected --</option>
                      {profilesList
                        .filter(p => p.role === 'technician')
                        .map(p => (
                          <option key={p.id} value={p.id}>
                            {p.full_name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddOrderModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading} className="gap-1.5 bg-violet-600 text-white">
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    Initialize Order
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Upload Document Modal */}
      <AnimatePresence>
        {showAddDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-xl z-10 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold">Attach Document</h3>
                <p className="text-xs text-zinc-500">Provide quotes or layout designs.</p>
              </div>
              <form onSubmit={handleAddDocument} className="space-y-3">
                <div className="space-y-1">
                  <Label>Document Title</Label>
                  <Input required value={newDoc.title} onChange={(e) => setNewDoc(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc(p => ({ ...p, category: e.target.value }))}
                    className="w-full h-8 px-2 border rounded-lg text-xs bg-white dark:bg-zinc-800"
                  >
                    {['Blueprint', 'Quotation', 'Invoice', 'Sign-off'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowAddDocModal(false); setSelectedOrderId(null); }}>Cancel</Button>
                  <Button type="submit" className="bg-violet-600 text-white">Upload</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Configure Dispatch Modal */}
      <AnimatePresence>
        {showCreateDispatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-xl z-10 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold">Configure Dispatch Logistics</h3>
              </div>
              <form onSubmit={handleCreateDispatch} className="space-y-3">
                <div className="space-y-1">
                  <Label>Driver Name</Label>
                  <Input required value={newDispatch.driverName} onChange={(e) => setNewDispatch(p => ({ ...p, driverName: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Driver Phone</Label>
                  <Input required value={newDispatch.driverPhone} onChange={(e) => setNewDispatch(p => ({ ...p, driverPhone: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Vehicle plate No</Label>
                  <Input required value={newDispatch.vehicleNo} onChange={(e) => setNewDispatch(p => ({ ...p, vehicleNo: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Expected Delivery Date</Label>
                  <Input type="date" required value={newDispatch.expectedDelivery} onChange={(e) => setNewDispatch(p => ({ ...p, expectedDelivery: e.target.value }))} />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowCreateDispatchModal(false); setSelectedOrderId(null); }}>Cancel</Button>
                  <Button type="submit" className="bg-violet-600 text-white">Confirm</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Technician Task Completion Modal (Photo + Notes required) */}
      <AnimatePresence>
        {showTechCompleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-2xl z-10 space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold font-heading flex items-center gap-1.5 text-purple-700">
                  <Camera className="size-5" /> Verify & Complete Installation
                </h3>
                <p className="text-xs text-zinc-500">Provide completion notes and upload a photo of the finished glazing setup.</p>
              </div>

              <form onSubmit={handleTechCompletionSubmit} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <Label htmlFor="t-notes">Installation Notes / Checklist Verification</Label>
                  <textarea
                    id="t-notes"
                    required
                    value={techUpload.notes}
                    onChange={(e) => setTechUpload(p => ({ ...p, notes: e.target.value }))}
                    rows={2}
                    placeholder="Describe completed tasks, glass alignment check, seal application, etc."
                    className="w-full text-sm border rounded-lg p-2.5 bg-transparent border-input focus:border-ring focus:ring-3 focus:ring-ring/50 outline-none text-zinc-900 dark:text-zinc-50 dark:border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo of Completed Installation (Required)</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850 relative">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleTechFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {techUpload.imageBase64 ? (
                      <div className="space-y-2 w-full flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={techUpload.imageBase64}
                          alt="Completion preview"
                          className="max-h-32 object-cover rounded-lg border border-zinc-200"
                        />
                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">{techUpload.imageName}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-zinc-400 gap-1.5">
                        <Camera className="size-8 text-zinc-300" />
                        <span className="font-semibold">Click or Drag & Drop photo</span>
                        <span className="text-[10px] text-zinc-400">PNG, JPG, HEIC up to 5MB</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowTechCompleteModal(false)
                      setSelectedOrderId(null)
                      setTechUpload({ notes: '', imageName: '', imageBase64: '' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !techUpload.imageBase64}
                    className="gap-1.5 bg-purple-700 text-white hover:bg-purple-800 border-0"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    Confirm & Complete Task
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. Order Details Modal */}
      <AnimatePresence>
        {selectedOrderDetails && (() => {
          const order = selectedOrderDetails
          const meta = parseOrderDescription(order.description)
          const dispatch = order.dispatches?.[0]
          
          const isApproved = statuses.indexOf(order.status) >= statuses.indexOf('Order Confirmed')
          const isFabricating = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Started')
          const isFabricated = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Completed')
          const isShipped = statuses.indexOf(order.status) >= statuses.indexOf('Dispatched')
          const isReady = order.status === 'Installation Completed'
          const uniqueCode = `YESHA-${order.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
          const assignedTech = order.project_members?.find((m: any) => m.profiles?.role === 'technician')?.profiles

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl z-10 space-y-6 overflow-y-auto max-h-[90vh] text-zinc-900 dark:text-zinc-50"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b pb-4 border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-violet-50 text-violet-750 dark:bg-violet-950/30 dark:text-violet-350 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="size-3 text-violet-500" /> Order Details
                    </span>
                    <h3 className="text-xl font-extrabold font-heading text-zinc-900 dark:text-white">{order.title}</h3>
                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                      <span>Status:</span>
                      {profile?.role === 'super_admin' ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="h-6 px-1.5 border rounded-lg text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-750 text-zinc-750 dark:text-zinc-350 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
                        >
                          {statuses.map(st => (
                            <option key={st} value={st}>
                              {st === 'Order Confirmed' ? 'Order Received' : st === 'Manufacturing Started' ? 'Sent for Production' : st === 'Manufacturing Completed' ? 'Ready' : st}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <strong className="text-indigo-650 dark:text-indigo-400 capitalize">
                          {order.status === 'Order Confirmed' ? 'Order Received' : order.status === 'Manufacturing Started' ? 'Sent for Production' : order.status === 'Manufacturing Completed' ? 'Ready' : order.status}
                        </strong>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile?.role === 'super_admin' && order.share_token && (
                      <Button
                        onClick={() => handleCopyInviteLink(order)}
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1"
                      >
                        {copiedOrderId === order.id ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                        Invite Customer
                      </Button>
                    )}
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-850 dark:hover:bg-zinc-800 animate-transition"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200 flex items-start gap-2">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                {/* Main Grid: Details & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Left Column: Metadata Specifications */}
                  <div className="space-y-4">
                    <div className="bg-zinc-50/50 dark:bg-zinc-950/30 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800 space-y-3">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Specifications</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-zinc-500">Quotation No</span>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{meta.quotationNo}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500">Customer No</span>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{meta.customerNo}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-zinc-150 dark:border-zinc-800">
                          <span className="text-zinc-400">Unique Order Verification Code</span>
                          <p className="font-mono font-extrabold text-violet-650 dark:text-violet-400 text-base mt-1 tracking-wider">{uniqueCode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-50/50 dark:bg-zinc-950/30 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800 space-y-2">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Customer Info</h4>
                      <div>
                        <span className="text-zinc-500">Name</span>
                        <p className="font-semibold text-zinc-850 dark:text-zinc-205 mt-0.5">{meta.customerName}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Delivery Address</span>
                        <p className="text-zinc-650 dark:text-zinc-400 flex items-start gap-1 mt-0.5 leading-relaxed"><MapPin className="size-3.5 shrink-0 mt-0.5" /> {meta.customerAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description & Progress */}
                  <div className="space-y-4">
                    <div className="bg-zinc-50/50 dark:bg-zinc-950/30 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800 space-y-2">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Technical Specs</h4>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{meta.description || 'No specifications provided.'}</p>
                    </div>


                    {/* Technician Assignment Widget */}
                    {assignedTech ? (
                      <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-900/50 rounded-xl text-[10px] text-purple-800 dark:text-purple-300 leading-normal flex justify-between items-center">
                        <div>
                          <strong className="block font-semibold mb-0.5 text-purple-700 dark:text-purple-400">Assigned Installation Technician</strong>
                          <span className="font-medium">{assignedTech.full_name}</span>
                        </div>
                        {profile?.role === 'super_admin' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-purple-650 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-750 font-bold underline px-1.5 h-6 text-[9px]"
                            onClick={() => handleRemoveTechnician(order.id, assignedTech.id)}
                          >
                            Change
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        {profile?.role === 'super_admin' ? (
                          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-900/50 rounded-xl text-[10px] text-purple-800 dark:text-purple-300 leading-normal space-y-2">
                            <strong className="block font-semibold">Assign Technician</strong>
                            {profilesList.filter(p => p.role === 'technician').length === 0 ? (
                              <div className="bg-white/50 dark:bg-zinc-900/50 p-2 rounded border border-purple-200/50 text-zinc-500 italic flex items-center justify-between">
                                <span>No technicians available.</span>
                                <span className="text-[9px] text-purple-600 font-semibold cursor-pointer underline" onClick={() => { setSelectedOrderDetails(null); setActiveTab('settings'); }}>Create one in Settings</span>
                              </div>
                            ) : (
                              <div className="flex gap-1.5">
                                <select
                                  value={selectedTechIdForAssign}
                                  onChange={(e) => setSelectedTechIdForAssign(e.target.value)}
                                  className="flex-1 h-7 px-1.5 border rounded-lg text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-750 text-zinc-750 dark:text-zinc-350 focus:outline-none"
                                >
                                  <option value="">-- Select Technician --</option>
                                  {profilesList
                                    .filter(p => p.role === 'technician')
                                    .map(p => (
                                      <option key={p.id} value={p.id}>
                                        {p.full_name}
                                      </option>
                                    ))
                                  }
                                </select>
                                <Button
                                  size="xs"
                                  onClick={() => handleAssignTechnician(order.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] h-7 px-2.5 shrink-0 border-0"
                                  disabled={!selectedTechIdForAssign}
                                >
                                  Assign
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-900/50 rounded-xl text-[10px] text-purple-800 dark:text-purple-300 leading-normal">
                            <strong className="block font-semibold mb-0.5">Technician Assignment</strong>
                            <span className="text-zinc-500 dark:text-zinc-400 italic">No technician assigned yet.</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Manufacturer claiming guidance if order is unclaimed by manufacturer */}
                    {profile?.role === 'super_admin' && !order.project_members?.some((m: any) => m.profiles?.role === 'manufacturer') && (
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/50 rounded-xl text-[10px] text-amber-800 dark:text-amber-300 leading-normal">
                        <strong className="block font-semibold mb-0.5">Manufacturer Link Unclaimed</strong>
                        Give code <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.2 rounded font-mono font-bold text-amber-900 dark:text-amber-400">{uniqueCode}</code> to the manufacturer to claim.
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Checklist (Icon-based tracking) */}
                <div className="space-y-3 border-t pt-4 border-zinc-100 dark:border-zinc-800">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="size-3.5" /> Progress Checklist
                  </h4>
                  <div className="grid grid-cols-5 gap-2 p-3 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-200/50 dark:border-zinc-800">
                    {[
                      { label: 'Order Received', achieved: isApproved, icon: CheckCircle, desc: 'Order Confirmed' },
                      { label: 'Sent for Production', achieved: isFabricating, icon: Building, desc: 'In Production' },
                      { label: 'Ready', achieved: isFabricated, icon: Layers, desc: 'Fabrication Completed' },
                      { label: 'Dispatched', achieved: isShipped, icon: Truck, desc: 'Logistics Dispatched' },
                      { label: 'Installed', achieved: isReady, icon: ShieldCheck, desc: 'Installation Complete' }
                    ].map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 text-center" title={item.desc}>
                          <div className={`p-2 rounded-xl border transition-all ${
                            item.achieved 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 shadow-sm' 
                              : 'bg-zinc-100/50 border-zinc-205 text-zinc-350 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-700'
                          }`}>
                            <Icon className="size-4 sm:size-5" />
                          </div>
                          <span className={`text-[9px] font-bold ${item.achieved ? 'text-zinc-800 dark:text-zinc-205' : 'text-zinc-400'}`}>
                            {item.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Logistics details if Shipped */}
                {dispatch && (
                  <div className="space-y-2 border-t pt-4 border-zinc-100 dark:border-zinc-800">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Truck className="size-3.5" /> Logistics Status
                    </h4>
                    <div className="bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200/40 p-4 rounded-xl text-xs grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-zinc-500">Shipping Status:</span>
                        <p className="font-bold text-orange-650">{dispatch.status}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Driver Assigned:</span>
                        <p className="font-medium text-zinc-850 dark:text-zinc-200">{dispatch.driver_name} ({dispatch.driver_phone || 'N/A'})</p>
                      </div>
                      <div>
                        <span className="text-zinc-505">Vehicle Number:</span>
                        <p className="font-mono text-zinc-800 dark:text-zinc-200">{dispatch.vehicle_no}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500">Expected Delivery:</span>
                        <p className="font-medium text-violet-600 dark:text-violet-400">{dispatch.expected_delivery_date || 'N/A'}</p>
                      </div>
                      {dispatch.tracking_notes && (
                        <div className="col-span-2 border-t pt-2 mt-1 text-[11px] text-zinc-500 italic">
                          Notes: {dispatch.tracking_notes}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents section */}
                {order.project_documents && order.project_documents.length > 0 && (
                  <div className="space-y-2 border-t pt-4 border-zinc-100 dark:border-zinc-800 text-xs">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Attached Documents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.project_documents.map((doc: any) => (
                        <div key={doc.id} className="p-2 border rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold truncate text-[11px]">{doc.title}</p>
                            <span className="text-[9px] bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-450 px-1.5 py-0.2 rounded uppercase">{doc.category}</span>
                          </div>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-zinc-205 border shrink-0 text-zinc-600 dark:border-zinc-800">
                            <FileDown className="size-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer (Manufacturer actions inside modal) */}
                <div className="flex justify-between items-center border-t pt-4 border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400">Created: {new Date(order.created_at).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    {/* Manufacturer Action options */}
                    {profile?.role === 'manufacturer' && (
                      <div className="flex gap-1.5 mr-2">
                        <Button
                          disabled={order.status !== 'Quotation Sent' && order.status !== 'Inquiry Received'}
                          onClick={() => handleUpdateStatus(order.id, 'Order Confirmed')}
                          variant="outline"
                          size="xs"
                          className="h-8 text-[10px]"
                        >
                          Order Received
                        </Button>
                        <Button
                          disabled={order.status !== 'Order Confirmed'}
                          onClick={() => handleUpdateStatus(order.id, 'Manufacturing Started')}
                          variant="outline"
                          size="xs"
                          className="h-8 text-[10px]"
                        >
                          Sent for Production
                        </Button>
                        <Button
                          disabled={order.status !== 'Manufacturing Started'}
                          onClick={() => handleUpdateStatus(order.id, 'Manufacturing Completed')}
                          variant="outline"
                          size="xs"
                          className="h-8 text-[10px]"
                        >
                          Ready
                        </Button>
                        <Button
                          disabled={order.status !== 'Manufacturing Completed'}
                          onClick={() => handleUpdateStatus(order.id, 'Dispatched')}
                          size="xs"
                          className="h-8 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                        >
                          Dispatched
                        </Button>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrderDetails(null)}>Close</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })()}
      </AnimatePresence>

      {/* Floating Sandbox Role Override Overlay */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {showSandbox ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 w-72 space-y-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Wrench className="size-3 text-violet-500" /> Dev Sandbox
                </span>
                <button
                  onClick={() => setShowSandbox(false)}
                  className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-500 dark:text-zinc-400"
                >
                  <X className="size-3" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-zinc-400 font-semibold mb-1">Switch simulated role:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'super_admin', label: 'Admin', color: 'border-amber-400' },
                    { id: 'customer', label: 'Customer', color: 'border-blue-400' },
                    { id: 'manufacturer', label: 'Manufacturer', color: 'border-emerald-400' },
                    { id: 'technician', label: 'Technician', color: 'border-purple-400' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSwitch(r.id)}
                      disabled={loading}
                      className={`px-2 py-1 border text-[11px] rounded-lg font-semibold transition-all ${
                        simulatedRole === r.id
                          ? `bg-zinc-950 dark:bg-zinc-800 text-white ${r.color} border-2`
                          : 'bg-zinc-50/50 hover:bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {loading && simulatedRole !== r.id ? '...' : r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <Button
                  onClick={handleSeedDemoData}
                  disabled={loading}
                  size="xs"
                  className="w-full justify-center gap-1.5 bg-violet-600 text-white hover:bg-violet-700 border-0"
                >
                  <RefreshCw className={`size-3 ${loading ? 'animate-spin' : ''}`} />
                  Seed Demo Data
                </Button>
                <p className="text-[9px] text-zinc-400 text-center leading-normal">
                  Populates orders, files, and chat rooms synced with database.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={() => setShowSandbox(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg text-xs"
            >
              <Wrench className="size-3.5" />
              Dev Sandbox
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
