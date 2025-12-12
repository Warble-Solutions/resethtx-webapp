import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- DEBUGGING LOGS (Check your VS Code Terminal) ---
  const rawPath = request.nextUrl.pathname
  console.log(`[Middleware] Checking path: ${rawPath}`)

  // 1. PROTECTED ROUTES LOGIC
  if (!user && rawPath.startsWith('/admin')) {
    
    // Explicitly allow these paths
    const isLoginPage = rawPath === '/admin/login'
    const isForgotPage = rawPath === '/admin/forgot-password'

    // If it is NOT login AND NOT forgot password -> Redirect
    if (!isLoginPage && !isForgotPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }
  }

  // 2. REDIRECT LOGIC (Logged in users shouldn't see login)
  if (user && rawPath === '/admin/login') {
     const url = request.nextUrl.clone()
     url.pathname = '/admin/dashboard'
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}