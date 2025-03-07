import axios from "axios"
import { ReceivedReviews } from "../../interface"
export default async function getProfessionals(request:string): Promise<ReceivedReviews>{
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/receivedreviews/${request}`
    console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    console.log(response);
    return await response.data.data[0]
}