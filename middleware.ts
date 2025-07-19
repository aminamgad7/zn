import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/vendor') && token?.role !== 'vendor') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/marketer') && token?.role !== 'marketer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/wholesaler') && token?.role !== 'wholesaler') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Protected routes that require authentication
        const protectedRoutes = ['/dashboard', '/admin', '/vendor', '/marketer', '/wholesaler'];
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        
        if (isProtectedRoute) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/vendor/:path*',
    '/marketer/:path*',
    '/wholesaler/:path*',
    '/auth/:path*',
  ],
};