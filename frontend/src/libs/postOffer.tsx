import axios from "axios"
import { z } from "zod";
import { OfferData, PostData } from "../../interface";
// type formType = z.infer<typeof formSchema>;
export default async function createOffer(data:OfferData,token:string){
    // console.log("FORMDATA",data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/create-offer`
    const response= await axios.post(
    apiUrl, 
    data, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })


    if(!response){
        throw new Error("Falied to create offer")
    }
    // const result =await response.json()
    console.log("Hello Create Offer",response)
    return await response
}