import axios from "axios"

export default async function postSendWork(postId:string,token:string){
    // console.log("FORMDATA",data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}/sendSubmission`
    const response= await axios.post(
    apiUrl, 
    {},
    {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })


    if(!response){
        throw new Error("Falied to Send work!")
    }
    console.log("Hello Send work Status",response)
    return await response
}