import axios from "axios"
import { SearchPosts } from "../../interface"
export default async function getMyProductionProfessionalPosts(request:string,token:string,userId:string,participantStatus?:string): Promise<SearchPosts>{
    let parti = participantStatus?`&participantStatus=${participantStatus}`:""
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/user/prof?${request}&userId=${userId}${parti}`;
    const response = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(!response){
        throw new Error("Falied to fetch his/her posts as professional")
    }
    console.log("Hello My-post as Prof",response)
    return await response.data.data
    
}