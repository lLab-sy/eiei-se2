import { auth } from "@/auth"
import AuthContext from "@/components/AuthProvider"
import { SessionProvider } from "next-auth/react"
import { redirect } from "next/navigation"


export default async function InLayout({children} : {children : React.ReactNode}){
    const session = await auth()
    if(!session?.user?.id){
        redirect('/login')
    }
    return (
        <AuthContext session={session}>
            {children}
        </AuthContext>
    )
}