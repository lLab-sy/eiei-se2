import axios from "axios";

export default async function getPrudcerOffers(token:string,postID:string){
  console.log(postID)
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/getOffers?postId=${postID}`
    try{
        const response = await axios.get(apiUrl, {
            withCredentials: true,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type" :  "multipart/form-data"
      
            }
          });
        if(!response){
            throw new Error("Falied to fetch his/her offers")
        }
        if (!response.data || response.data.status !== "success") {
            throw new Error("Failed to fetch offer");
          }
      
          console.log("Hello My Offers:", response.data.data.data);
          return response.data.data.data;
    }catch(error){
        console.error("Error fetching my offers:", error);
        throw error;
    }
}