/*
 * These routes are public and can be accessed without authentication
 * @type {string[]}
*/
export const publicRoutes=[
    "/",
]

/*
 * These routes are used for authentication
 * @type {string[]}
*/
export const authRoutes=[
    "/register",
    "/login",
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