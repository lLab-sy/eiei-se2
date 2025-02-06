import axios from "axios"
import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials' 
export const loginUser = async (data: {username:string, password:string}) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`
    const dataPost = {
        username : data.username,
        password: data.password,
    }
    const res = await axios.post(apiUrl, dataPost)
    
    // data => token + user => id + username + role
    if(res.status !== 200 || !res.data){
        throw new Error('Cannot find User data')
        
    }


    return res.data;
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            username: {},
            password: {},
        },
        async authorize(credentials) {
            try{
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }
                const sendData = {
                    username: credentials.username ?? "",
                    password: credentials.password ?? '',
                }
                const user = await loginUser(sendData as {username: string, password:string})
                
                if (!user || user?.status === 'error') {
                    throw new Error("Invalid username or password"); // ✅ More specific error
                }
        
                return {
                    // id from mongo
                    id: user.data.user.id,
                    username: user.data.user.username,
                    role: user.data.user.role,
                    token: user.data.token
                }
            }
            catch(err){
                throw new Error("Login failed");                      
            }
        }
    })

  ],
  callbacks:{
    jwt({token, user} : {token : any, user : any}){
        if(user){
            token.id = user.id
            token.token = user.token
            token.username= user.username
            token.role = user.role
        }
        return token;
    },
    session({session, token}  : {token : any, session : any}){
        if(token){
            session.user.id = token.id as string;
            session.user.username = token.username;
            session.user.role = token.role;
            session.user.token = token.token    
        }
        return session
    },
    redirect({url, baseUrl}){
        return baseUrl
    },
    signIn({ user }){
        if(!user){
            return false
        }
        return true
    }
   
  },
  pages: {
    signIn: '/login',
  }
})