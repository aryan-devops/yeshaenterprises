import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { AlertCircle } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PublicTrackingClient from './public-tracking-client'

export default async function PublicTrackingPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params
  const token = params.token
  const supabase = await createClient()

  // Fetch project from Supabase matching the share_token
  const { data: order, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      status,
      created_at,
      dispatches (
        status,
        driver_name,
        vehicle_no,
        expected_delivery_date,
        tracking_notes
      ),
      project_documents (
        id,
        title,
        category,
        file_url
      )
    `)
    .eq('share_token', token)
    .single()

  let chatRoomId: string | null = null
  let activeProfile: any = null

  if (order) {
    const { data: chatRoom } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('project_id', order.id)
      .maybeSingle()
    if (chatRoom) {
      chatRoomId = chatRoom.id
    }

    // Load active profile if they are logged in via custom yesha_session
    const cookieStore = await cookies()
    const hasSession = cookieStore.get('yesha_session')?.value === 'aryan05'
    if (hasSession) {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', '1befb220-a87e-4937-ab53-fc265cb1320d')
        .single()
      if (p) {
        activeProfile = { ...p, email: 'aryan05@yesha.com' }
      }
    }
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans">
        <Card className="w-full max-w-md border-zinc-200 text-center p-6 space-y-4">
          <AlertCircle className="size-12 mx-auto text-red-500" />
          <h1 className="text-xl font-bold">Order Not Found</h1>
          <p className="text-sm text-zinc-500">
            We couldn&apos;t retrieve the order associated with this tracking link. Please contact the administrator to get a valid URL.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <PublicTrackingClient
      order={order}
      chatRoomId={chatRoomId}
      initialProfile={activeProfile}
    />
  )
}
