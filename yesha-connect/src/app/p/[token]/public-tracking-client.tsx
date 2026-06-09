'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Building,
  Layers,
  Truck,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Clock,
  Sparkles,
  MessageSquare,
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PublicChatClient from './public-chat-client'

interface PublicTrackingClientProps {
  order: any
  chatRoomId: string | null
  initialProfile: any
}

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
    // Ignore fallback
  }
  return {
    description: descText || '',
    quotationNo: 'N/A',
    customerNo: 'N/A',
    customerName: 'N/A',
    customerAddress: 'N/A'
  }
}

export default function PublicTrackingClient({ order, chatRoomId, initialProfile }: PublicTrackingClientProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const meta = parseOrderDescription(order.description)
  const dispatch = order.dispatches?.[0]
  
  const isApproved = statuses.indexOf(order.status) >= statuses.indexOf('Order Confirmed')
  const isFabricating = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Started')
  const isFabricated = statuses.indexOf(order.status) >= statuses.indexOf('Manufacturing Completed')
  const isShipped = statuses.indexOf(order.status) >= statuses.indexOf('Dispatched')
  const isReady = order.status === 'Installation Completed'

  const displayStatus = order.status === 'Order Confirmed' 
    ? 'Order Received' 
    : order.status === 'Manufacturing Started' 
      ? 'Sent for Production' 
      : order.status === 'Manufacturing Completed' 
        ? 'Ready' 
        : order.status

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: CheckCircle },
    { id: 'logistics', name: 'Logistics', icon: Truck, visible: !!dispatch },
    { id: 'documents', name: 'Documents & Sign-offs', icon: FileText },
    { id: 'chat', name: 'Chat Discussion', icon: MessageSquare, visible: !!chatRoomId }
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 font-sans w-full overflow-hidden">
      {/* Mobile Top Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 md:hidden w-full shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <Menu className="size-4" />
          </button>
          <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
            Y
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            Tracking Portal
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
          {displayStatus}
        </span>
      </header>

      {/* Sidebar Navigation */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shrink-0`}
      >
        {/* Brand details and Close button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              Y
            </div>
            <span className="font-heading text-md font-bold tracking-tight text-zinc-900 dark:text-white">
              YESHA tracking
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 md:hidden dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Dynamic Summary Panel */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-850">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
            <Sparkles className="size-3" /> Order Overview
          </span>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{order.title}</h2>
          <p className="text-[10px] text-zinc-400 mt-0.5">Quote: <strong className="text-zinc-700 dark:text-zinc-300">{meta.quotationNo}</strong></p>
          <div className="mt-3 py-1 px-2 border rounded-lg text-[9px] font-bold capitalize inline-block text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700">
            Unique Code: <code className="text-violet-600 dark:text-violet-400">YESHA-{order.id.slice(0, 6).toUpperCase()}</code>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            if (item.visible === false) return null
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-50 shadow-md'
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-50'
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
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Live Status Tracking</span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-0.5">{order.title}</h1>
          </div>
          <span className={`px-4 py-1 border text-xs font-bold rounded-full self-start ${getStatusColor(order.status)}`}>
            {displayStatus}
          </span>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metadata Specs Grid */}
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5"><User className="size-4 text-violet-500" /> Quotation & Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 dark:text-zinc-500">Quotation Number</span>
                  <p className="font-bold text-zinc-850 dark:text-zinc-200 text-sm mt-0.5">{meta.quotationNo}</p>
                </div>
                <div>
                  <span className="text-zinc-400 dark:text-zinc-500">Customer Number</span>
                  <p className="font-bold text-zinc-850 dark:text-zinc-200 text-sm mt-0.5">{meta.customerNo}</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 dark:text-zinc-500">Customer Name</span>
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">{meta.customerName}</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 dark:text-zinc-500">Delivery Address</span>
                  <p className="text-zinc-650 dark:text-zinc-400 mt-0.5 flex items-start gap-1"><MapPin className="size-3.5 shrink-0 mt-0.5" /> {meta.customerAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Condition tracking progress checklist */}
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5"><Clock className="size-4 text-violet-500" /> Progress Milestone Tracker</CardTitle>
                <CardDescription className="text-xs">Real-time update on manufacturing and dispatch status.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-50/40 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-850">
                  {[
                    { label: 'Order Received', achieved: isApproved, icon: CheckCircle, desc: 'Order Confirmed' },
                    { label: 'Sent for Production', achieved: isFabricating, icon: Building, desc: 'In Production' },
                    { label: 'Ready', achieved: isFabricated, icon: Layers, desc: 'Ready for Dispatch' },
                    { label: 'Dispatched', achieved: isShipped, icon: Truck, desc: 'Dispatched to Site' },
                    { label: 'Installed', achieved: isReady, icon: ShieldCheck, desc: 'Installation Completed' }
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex flex-row sm:flex-col items-center gap-2.5 relative cursor-default w-full sm:w-auto" title={item.desc}>
                        <div className={`p-2 rounded-xl border transition-all shrink-0 ${
                          item.achieved 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 shadow-sm' 
                            : 'bg-zinc-100 border-zinc-200 text-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-750'
                        }`}>
                          <Icon className="size-4 sm:size-5" />
                        </div>
                        <div className="text-left sm:text-center">
                          <p className={`text-[10px] font-bold ${item.achieved ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>
                            {item.label}
                          </p>
                          <span className="text-[8px] text-zinc-400 dark:text-zinc-500 block leading-tight">{item.desc}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* LOGISTICS TAB */}
        {activeTab === 'logistics' && dispatch && (
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5"><Truck className="size-4 text-violet-500" /> Dispatch & Delivery Logistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/40 p-4 rounded-xl">
                <div>
                  <span className="text-zinc-500">Shipping Status</span>
                  <p className="font-bold text-orange-600 text-sm mt-0.5">{dispatch.status}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Expected Delivery</span>
                  <p className="font-semibold text-violet-600 dark:text-violet-400 text-sm mt-0.5">
                    {dispatch.expected_delivery_date ? new Date(dispatch.expected_delivery_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-150 dark:border-zinc-800">
                  <span className="text-zinc-500">Driver Assigned</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{dispatch.driver_name || 'N/A'}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-150 dark:border-zinc-800">
                  <span className="text-zinc-500">Vehicle Registration Number</span>
                  <p className="font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">{dispatch.vehicle_no || 'N/A'}</p>
                </div>
              </div>
              {dispatch.tracking_notes && (
                <div className="p-3 bg-zinc-55/40 dark:bg-zinc-900/20 border rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Logistics Remarks</span>
                  <p className="text-zinc-605 italic mt-1 leading-normal">{dispatch.tracking_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Proof of installation completion */}
            {order.project_documents && order.project_documents.some((d: any) => d.category === 'Sign-off') ? (
              <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5"><ShieldCheck className="size-4 text-violet-500" /> Completion Sign-off Proof</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.project_documents
                      .filter((d: any) => d.category === 'Sign-off')
                      .map((doc: any) => (
                        <div key={doc.id} className="border border-zinc-200/50 dark:border-zinc-850 p-3 rounded-2xl bg-white dark:bg-zinc-900 space-y-2 shadow-xs">
                          <p className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-200">{doc.title}</p>
                          {doc.file_url.startsWith('data:image/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={doc.file_url}
                              alt="Installation completion proof"
                              className="max-h-48 w-full object-cover rounded-xl border border-zinc-200/50 dark:border-zinc-800"
                            />
                          ) : (
                            <p className="text-[11px] text-zinc-500 italic">No image file content.</p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Document Library */}
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5"><FileText className="size-4 text-violet-500" /> Document Library</CardTitle>
                <CardDescription className="text-xs">Access linked order documents and blueprint blueprints.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {order.project_documents && order.project_documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.project_documents
                      .filter((d: any) => d.category !== 'Sign-off')
                      .map((doc: any) => (
                        <div key={doc.id} className="p-3 border border-zinc-200/50 dark:border-zinc-850 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-between shadow-xs">
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-200">{doc.title}</p>
                            <span className="text-[8px] px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-800 rounded uppercase font-bold text-zinc-400 mt-1 inline-block">
                              {doc.category}
                            </span>
                          </div>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg border text-[10px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            View Document
                          </a>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic text-center py-6">No files uploaded for this order yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && chatRoomId && (
          <div className="space-y-4">
            <div className="p-3 bg-white dark:bg-zinc-900 border rounded-2xl border-zinc-200/60 shadow-sm">
              <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Live Team Discussion</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Post updates or address questions on this order directly.</p>
            </div>
            <PublicChatClient orderId={order.id} chatRoomId={chatRoomId} initialProfile={initialProfile} />
          </div>
        )}
      </main>
    </div>
  )
}
