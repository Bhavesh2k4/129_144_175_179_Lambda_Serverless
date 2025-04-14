/*
 * These routes are public and can be accessed without authentication
 * @type {string[]}
*/
export const publicRoutes=[
    /^\/$/,  // homepage - "/",
    /^\/api\/function\/[^\/]+\/[^\/]+\/docker$/, // function docker route - "/api/function/[userId]/[handler]/docker"
    /^\/api\/function\/[^\/]+\/[^\/]+\/docker\/.*$/, // function docker route with query params - "/api/function/[userId]/[handler]/docker?query=param"
    /^\/api\/function\/[^\/]+\/[^\/]+\/nanos$/, // function nanos route - "/api/function/[userId]/[handler]/nanos"
    /^\/api\/function\/[^\/]+\/[^\/]+\/nanos\/.*$/, // function nanos route with query params - "/api/function/[userId]/[handler]/nanos?query=param"
    /^\/new-verification$/ // new verification route - "/new-verification"
  ]
  

/*
 * These routes are used for authentication
 * @type {string[]}
*/
export const authRoutes=[
    "/register",
    "/login",
     "/error",
     '/reset-password',
     '/new-password',
]

/*
 * These routes are used for API authentication
 * @type {string}
*/
export const apiAuthPrefix="/api/auth"

/*
 * Default route after login
 * @type {string}
*/
export const DEFAULT_LOGIN_USER_REDIRECT = "/user"