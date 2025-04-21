import axios from "axios"
import { SearchPosts } from "../../interface"
export default async function getPosts(request:string): Promise<SearchPosts>{
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/search?${request}`
    console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    
    return await response.data.data
}