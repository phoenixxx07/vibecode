import { authConfig } from "@/lib/auth.config";

import NextAuth from "next-auth";

import { NextResponse } from "next/server";



const { auth } = NextAuth(authConfig);



export default auth((req) => {

  const { pathname } = req.nextUrl;

  const isLoggedIn = !!req.auth;

  const isAdmin = req.auth?.user?.role === "admin";



  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/submit") ||
    pathname === "/requests/new"
  ) {

    if (!isLoggedIn) {

      const loginUrl = new URL("/login", req.nextUrl.origin);

      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);

    }

  }



  if (pathname.startsWith("/admin")) {

    if (!isLoggedIn) {

      const loginUrl = new URL("/login", req.nextUrl.origin);

      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);

    }

    if (!isAdmin) {

      return NextResponse.redirect(new URL("/", req.nextUrl.origin));

    }

  }



  return NextResponse.next();

});



export const config = {

  matcher: ["/dashboard/:path*", "/submit", "/requests/new", "/admin/:path*"],

};

