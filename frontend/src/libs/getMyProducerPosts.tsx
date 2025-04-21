import axios from "axios"
import { SearchPosts } from "../../interface"
export default async function getMyProducerPosts(request:string,token:string): Promise<SearchPosts>{
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/user/producer?${request}`
    console.log("apiURL",apiUrl)
    const response= await axios.get(apiUrl, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
  
        }
      })
    console.log("Hello My-post",response)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    
    return await response.data.data
}