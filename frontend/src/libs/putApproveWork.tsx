import axios from "axios"
import { ApproveData, ChangeParticipantStatus } from "../../interface"

export default async function putApproveWork(postID:string,data:ApproveData,token:string){
    // console.log("FORMDATA",data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/${postID}/sendApprove?userId=${data.userId}&isApprove=${data.isApprove}`
    console.log("token",token)
    console.log(data)
    const response = await axios.put(
        apiUrl,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Ensure cookies are included
        }
    );

    if(!response){
        throw new Error("Falied to Approve")
    }
    console.log("Hello Change Participant Status",response)
    return await response.data.status
}
