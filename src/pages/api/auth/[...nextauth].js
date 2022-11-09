import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {

        const {username, password} = credentials

        if (username !== "Carlos Cat" || password !== "password") {
          throw new Error('Invalid username/password')
        }
        const user = { id: "1", name: "Carlos Cat", email: "carlos@example.com" }
  
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
}
export default NextAuth(authOptions)