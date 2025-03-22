import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AuthContext from "@/components/AuthProvider"


export default async function InLayout({children} : {children : React.ReactNode}){
    const session = await auth()
    if(!session?.user?.id ){
        redirect('/login')
    }
    
    
    return (
        <AuthContext session={session}>
            {children}
        </AuthContext>
    )
}