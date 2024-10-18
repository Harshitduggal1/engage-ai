import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

export async function customHandleAuth(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const authType = request.nextUrl.pathname.split('/').pop();

    switch (authType) {
      case 'login':
        // Redirect to Kinde login page
        return NextResponse.redirect(new URL('/api/auth/login', request.url));
      case 'register':
        // Redirect to Kinde register page
        return NextResponse.redirect(new URL('/api/auth/register', request.url));
      case 'logout':
        // Handle logout
        return NextResponse.redirect(new URL('/', request.url));
      case 'callback':
        // Handle callback after successful authentication
        const user = await getUser();
        if (user) {
          return NextResponse.redirect(new URL('/forum/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      default:
        // Check if user is authenticated
        const isAuthed = await isAuthenticated();
        if (isAuthed) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
  } catch (error) {
    console.error('Kinde Auth Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}