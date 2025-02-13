import axios from "axios"

export default async function getPostRoles(){

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/postRoles`
    const response= await axios.get(apiUrl)


    if(!response){
        throw new Error("Falied to fetch all roles")
    }
    // const result =await response.json()
    console.log("Hello All Roles",response)
    return await response
}