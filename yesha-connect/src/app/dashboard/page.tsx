import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import DashboardClientView from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('yesha_session')?.value

  let userProfile: any = null

  if (sessionCookie) {
    if (sessionCookie === 'aryan05') {
      // Bypass Supabase auth and load the existing super_admin profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', '1befb220-a87e-4937-ab53-fc265cb1320d')
        .single()

      if (profile) {
        userProfile = {
          ...profile,
          email: 'aryan05@yesha.com'
        }
      }
    } else {
      // Try to load technician profile (sessionCookie is profile UUID)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionCookie)
        .single()

      if (profile) {
        userProfile = {
          ...profile,
          email: `${profile.full_name?.toLowerCase().replace(/\s+/g, '') || 'technician'}@yesha.com`
        }
      }
    }
  }

  if (!userProfile) {
    // Fallback to Supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
            role: 'customer',
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error('Error creating fallback profile:', createError)
        profile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          role: 'customer',
          company_name: '',
          avatar_url: '',
          phone: '',
        }
      } else {
        profile = newProfile
      }
    }

    userProfile = {
      ...profile,
      email: user.email,
    }
  }

  // 3. Fetch projects that user has access to
  // Supabase RLS will filter this list based on user's role and membership
  const { data: projects, error: projectsError } = await supabase
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

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  // 4. Fetch all profiles if user is super_admin (to allow membership assignments)
  let allProfiles: any[] = []
  if (userProfile.role === 'super_admin') {
    const { data: profilesList } = await supabase
      .from('profiles')
      .select('id, full_name, role, company_name')
      .order('full_name', { ascending: true })
    
    allProfiles = profilesList || []
  }

  return (
    <DashboardClientView
      initialProfile={userProfile}
      initialProjects={projects || []}
      allProfiles={allProfiles}
    />
  )
}
