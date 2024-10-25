import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/emprestimos', '/emprestar']

function checkIfIsProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((protectedRoute) =>
    pathname.startsWith(protectedRoute),
  )
}

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const user = await supabase.auth.getUser()

  // protected routes
  if (checkIfIsProtectedRoute(request.nextUrl.pathname) && user.error) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (request.nextUrl.pathname === '/' && !user.error) {
    return NextResponse.redirect(new URL('/emprestimos', request.url))
  }

  return response
}
