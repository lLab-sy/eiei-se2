'use server'

import { auth, signIn } from "@/auth"
import { getSession } from "next-auth/react";

export const userLogin = async (data: {username: string, password:string}) => {
      await signIn('credentials', {
        ...data,
        redirect: true  
      })
      // alert('User', )
      // console.log('user login data',user)
      // if(res?.error){
      //   return;
      // }
      // const session = await auth()
      // console.log('session login', session)


    
    
}