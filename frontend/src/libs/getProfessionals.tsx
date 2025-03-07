import axios from "axios"
import { ProfessionalsData } from "../../interface"
export default async function getProfessionals(request:string): Promise<ProfessionalsData>{
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/search/${request}`
    //console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    
    return await response.data.data
}