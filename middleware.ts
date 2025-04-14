import authConfig from "./auth.config"
import NextAuth from "next-auth"
const {auth}=NextAuth(authConfig)
import { publicRoutes , authRoutes, apiAuthPrefix, DEFAULT_LOGIN_USER_REDIRECT} from "@/routes"
import { NextResponse } from "next/server"


export default auth((req)=>{
    const isLoggedIn = !!req.auth;
    const {nextUrl} = req
    console.log("[ROUTE] : ",nextUrl.pathname)
    console.log("[AUTH] isLoggedIn? : ",isLoggedIn)
    const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.some((route) =>
        route instanceof RegExp ? route.test(nextUrl.pathname) : route === nextUrl.pathname
    )
      
      
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    //allow all api routes
    if (isAPIAuthRoute) {
        return
    }
    //if user logged in and is in auth pages(login or register), redirect the user
    // if user not logged in and is in auth pages(login or register), do nothing
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_USER_REDIRECT,nextUrl))
        }
        return
    }
    //if user not logged in and is in protected routes, redirect the user to login

    if(!isLoggedIn && !isPublicRoute){
        return NextResponse.redirect(new URL("/login",nextUrl))
    }
    return
})

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }