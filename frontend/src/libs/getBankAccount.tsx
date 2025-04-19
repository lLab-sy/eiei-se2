import { BankAccountResponse } from "@/app/(logged-in)/user-profile/profileComponents/ProfileEdit";
import axios from "axios"

export default async function getBankAccount(userID : string, token: string) : Promise<BankAccountResponse> {

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transfer/bank-accounts/${userID}`;
    const response= await axios.get(apiUrl,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    if(!response){
        throw new Error("Falied to fetch bank account")
    }
    // const result =await response.json()
    console.log("Hello Bank Account",response)
    return await response.data.data as BankAccountResponse
}