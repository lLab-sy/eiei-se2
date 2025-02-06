export default async function getHistoryPosts(id:string){

    const response = await fetch(`http://localhost:1000/api/v1/posts/user/${id}`)
    if(!response.ok){
        throw new Error("Falied to fetch posthistory")
    }
    const result =await response.json()
    console.log("Hello",result)
    return await result
}