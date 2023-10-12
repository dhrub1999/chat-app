import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith('/login');

    const sensitiveRoutes = ['/dashboard']; //? If the user is not logged in then they can't access the dashboard

    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    ); //?returns true if the user is trying to redirect to the dashboard page

    //? If the user is already authenticated the middleware will redirect the user to their desired page
    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return NextResponse.next();
    }

    //? If the user is not logged in then the app will redirect them to the login page if they trying to access the dashboard page

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true; //* Because of this the middleware function above will always called and it will not create an infinite redirect
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
