import axios from "axios"
import { ChangeParticipantStatus } from "../../interface"

export default async function patchChangeParticipantStatus(data:ChangeParticipantStatus,token:string){
    // console.log("FORMDATA",data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/participant-status`
    const response= await axios.patch(
    apiUrl, 
    data, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })


    if(!response){
        throw new Error("Falied to create offer")
    }
    console.log("Hello Change Participant Status",response)
    return await response
}