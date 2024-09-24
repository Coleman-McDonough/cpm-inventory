import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const secret = process.env.NEXT_AUTH_SECRET || ""

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret,
})

export { handler as GET, handler as POST }
