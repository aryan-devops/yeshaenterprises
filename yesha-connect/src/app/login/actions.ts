'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const username = (formData.get('username') as string || '').trim()
  const password = formData.get('password') as string

  let sessionVal = ''

  if (username === 'aryan05' && password === 'Aryan@#2003') {
    sessionVal = 'aryan05'
  } else {
    // Check credentials in the database
    const supabase = await createClient()
    let creds = null
    
    // First try new unified credentials table
    const { data: newCreds } = await supabase
      .from('app_credentials')
      .select('profile_id')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle()

    if (newCreds) {
      creds = newCreds
    } else {
      // Fallback for existing technicians if migration isn't run yet
      const { data: oldCreds } = await supabase
        .from('technician_credentials')
        .select('profile_id')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle()
      creds = oldCreds
    }

    if (creds) {
      sessionVal = creds.profile_id
    }
  }

  if (!sessionVal) {
    redirect('/login?message=Invalid User ID or Password')
  }

  // Set local verification cookie
  const cookieStore = await cookies()
  cookieStore.set('yesha_session', sessionVal, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  redirect('/login')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('yesha_session')
  
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}


