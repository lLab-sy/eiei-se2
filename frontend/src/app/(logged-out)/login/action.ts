'use server'

import { signIn } from "@/auth"

export const userLogin = async (data: {username: string, password:string}) => {
      await signIn('credentials', {
        ...data,
        redirect: true  
      })

    
    
}