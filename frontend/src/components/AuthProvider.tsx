'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export const metadata = {
  title: 'My App',
  description: 'My description',
}

export interface AuthContextProps {
  children: React.ReactNode
  session: any
}

export default function AuthContext({ children,session }: AuthContextProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
