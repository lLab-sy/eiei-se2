import axios from "axios"
export default async function getPostUser(userID:string){
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts?userID=${userID}`
    console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
 
    console.log("Hello All Post Mine",response)
    return await response
}