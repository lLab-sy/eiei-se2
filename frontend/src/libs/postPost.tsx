import axios from "axios"
import { z } from "zod";
import { PostData } from "../../interface";
// type formType = z.infer<typeof formSchema>;
export default async function createPost(data:FormData,token:string){
    console.log("FORMDATA",data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts`
    const response= await axios.post(
    apiUrl, 
    data, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type" :  "multipart/form-data"

        }
      })


    if(!response){
        throw new Error("Falied to create post")
    }
    // const result =await response.json()
    console.log("Hello Create Post",response)
    return await response
}