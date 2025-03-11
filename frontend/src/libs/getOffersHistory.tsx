import axios from "axios";

export default async function getOfferHistory(token:string,userId:string){
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/getOffers?userId=${userId}`
    try{
        console.log(userId)
        const response = await axios.get(apiUrl, {
            withCredentials: true,
            headers: {
              "Authorization": `Bearer ${token}`,
      
            }
          });
        if(!response){
            throw new Error("Falied to fetch his/her offers")
        }
        if (!response.data || response.data.status !== "success") {
            throw new Error("Failed to fetch offer");
          }
      
          console.log("Hello My Minimal Offers:", response.data.data);
          return response.data.data.data;
    }catch(error){
        console.error("Error fetching my offers:", error);
        throw error;
    }
}