import axios from "axios"

export default async function getMediaTypes(){

    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/mediaTypes`
    const response= await axios.get(apiUrl)


    if(!response){
        throw new Error("Falied to fetch all mediaTypes")
    }

    // console.log("Hello All Media Types",response)
    return await response
}