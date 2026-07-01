import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  
  // Validate next against an internal allow-list to prevent open redirect vulnerabilities
  const allowedPaths = ['/', '/partner/onboarding', '/partner/dashboard', '/account/profile'];
  if (!allowedPaths.includes(next)) {
    next = '/';
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Check if user is brand new by comparing created_at and last_sign_in_at
      // This avoids server clock skew issues between Vercel and Supabase
      const createdAt = new Date(data.user.created_at).getTime();
      const lastSignIn = new Date(data.user.last_sign_in_at || data.user.created_at).getTime();
      // If last_sign_in_at is within 5 seconds of created_at, it's their first time signing in
      const isBrandNewUser = Math.abs(lastSignIn - createdAt) < 5000;

      if (isBrandNewUser && !next.startsWith('/partner')) {
        // Redirect to setup password page for first-time OAuth users (Customers)
        return NextResponse.redirect(`${origin}/setup-password`);
      }

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`);
}
