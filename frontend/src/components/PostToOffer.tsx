import { PostData } from "../../interface"

interface postContent {
    postName : string,
    postMediaType : string,
    userID: string,
    postStatus : string,

}

export default function PostToOffer({post} : { post : PostData}){
    const mockPost : postContent = {
        postName : "PostName",
        postMediaType : "postMediaType",
        userID : "userID",
        postStatus : "postStatus"
    }
    const offerDateStart = new Date(post?.startDate ?? "")
    const startDate = offerDateStart.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    const offerDateEnd = new Date(post?.endDate ?? "")
    const endDate = offerDateEnd.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return (
        <div className=' hover:bg-slate-50 flex h-[100px] mx-[5%] '>
            
            <div className={`w-[1%] ${(post.postStatus === 'created') ? "bg-lime-400" : "bg-red-400"}`}></div>
            <div className='border flex items-center w-full justify-around'>
                <span>{`${post.postName}`}</span>
                <span>{`Status: ${post.postStatus}`}</span>
                <span>{`Start: ${startDate}`}</span>
                <span>{`End: ${endDate}`}</span>
            </div>
        </div>

    )
}