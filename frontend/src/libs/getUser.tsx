import axios from "axios"
export default async function getUser(userID:string){
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/users/${userID}`
    console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    console.log("HELLO USER",response.data.data)
    return await response.data.data
}