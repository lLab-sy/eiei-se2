import dynamic from "next/dynamic"
import { Suspense } from "react"

const ProfileComponent = dynamic(() => import('./profileComponents/ProfileComponent'))
export default function ProfilePage(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileComponent />
    </Suspense>
  )
}