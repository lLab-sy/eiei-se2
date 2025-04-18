import dynamic from "next/dynamic"
import { Suspense } from "react"
import ProfileComponent from "./profileComponents/ProfileComponent"

// const ProfileComponent = dynamic(() => import('./profileConponents/ProfileComponent'))
export default function ProfilePage(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileComponent />
    </Suspense>
  )
}