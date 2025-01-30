import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials' 

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            username: {},
            password: {},
        },
        async authorize(credentials) {
            // fetch users from backend
            const user = { //mock data
                username: 'พอกันทีกับคนหลายใจ',
                password: '12345678!',
            }
            if(user.username != credentials.username && user.password != credentials.password){
                throw new Error("Incorrect Credentials")
            }
            if(!user){
                throw new Error("Incorrect Credentials")
            }
            
            return {
                // id from mongo
                id: '1',
                username: user.username
            }
        }
    })

  ],
  callbacks:{
    jwt({token, user}){
        if(user){
            token.id = user.id
        }
        return token;
    },
    session({session, token}){
        session.user.id = token.id as string;
        return session
    },
    redirect({url, baseUrl}) {
        return baseUrl
    },
   
  },
  
})