import { TransactionResponse } from "@/app/(logged-in)/user-profile/profileComponents/ProfileEdit";
import axios from "axios"

export default async function getProfessionalTransactions(token: string) : Promise<TransactionResponse[]> {

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transfer/transactions`
    const response= await axios.get(apiUrl,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    if(!response){
        throw new Error("Falied to fetch post history")
    }
    // const result =await response.json()
    console.log("Hello All Post",response)
    return await response.data.data as TransactionResponse[]
}