import axios from "axios"
export default async function getPostUser(userID:string,status?:boolean){ //Producer can only use
    let offerDo="";
    if(status){
        offerDo="&postStatus=created,waiting"
    }
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts?userID=${userID}`+offerDo
    console.log(apiUrl)
    try{
        const response= await axios.get(apiUrl)
        if(!response){
            throw new Error("Falied to fetch his/her posts")
        }
        if (!response.data || response.data.status !== "success") {
            throw new Error("Failed to fetch post by ID");
          }
      
          console.log("Hello All Post Mine:", response.data.data);
          return response.data.data;
    }catch(error){
        console.error("Error fetching post by ID:", error);
        throw error;
    }
}
