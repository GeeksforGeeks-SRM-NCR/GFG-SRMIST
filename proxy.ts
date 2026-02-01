import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Check if user is blacklisted using college_email
    if (user && user.email) {
        const { data: blacklisted } = await supabase
            .from('blacklist')
            .select('email')
            .eq('email', user.email)
            .maybeSingle();

        if (blacklisted) {
            // Blacklisted users are blocked from practice, leaderboard, and challenges
            if (
                request.nextUrl.pathname.startsWith('/practice') ||
                request.nextUrl.pathname.startsWith('/leaderboard') ||
                request.nextUrl.pathname.startsWith('/pages/challenges')
            ) {
                // Sign out the blacklisted user
                await supabase.auth.signOut();
                return NextResponse.redirect(new URL('/userlogin?error=blacklisted', request.url));
            }
        }
    }

    // 1. Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // Check if user's email is in the allowed admin emails list
        const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
        if (!allowedEmails.includes(user.email || '')) {
            // Unauthorized access attempt - sign out and redirect
            await supabase.auth.signOut();
            return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
        }
    }

    // 2. Redirect logged-in users away from /login
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};