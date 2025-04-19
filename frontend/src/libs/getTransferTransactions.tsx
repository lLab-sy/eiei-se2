import axios from "axios"
export default async function getProfessionals(){
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transfer/transactions`;
    console.log(apiUrl)
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch his/her posts")
    }
    console.log(response);
    return await response.data.data[0]
}