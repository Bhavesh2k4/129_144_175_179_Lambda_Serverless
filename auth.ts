import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages:{
      signIn:"/login",
      error:"/error",
  },
  events:{
    async linkAccount({user}){
        await db.user.update({
            where:{
                id:user.id
            },
            data:{
                emailVerified:new Date()
            }
        })
    }
  },
  callbacks: {
        async signIn({user,account}){
            if(account?.provider!=="credentials"){
                return true
            }
            const existingUser=await getUserById(user.id as string);
            if(!existingUser?.emailVerified){
                return false
            }
            return true
        },
      async session({session, token}){
          if(token.sub && session.user){
              session.user.id = token.sub
          }

          if(token.role&&session.user){
              session.user.role=token.role as UserRole
          }
          return session

      },
      //token has name,email,picture,sub (your id),iat , exp,jti
      async jwt({token}){
          if(!token.sub){
              return token
          }
          const existingUser=await getUserById(token.sub)
          if(!existingUser){
              return token
          }
          token.role=existingUser.role
          return token
      }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})