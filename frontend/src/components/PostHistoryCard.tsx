import Image from "next/image";
import { Project } from "../../interface";

export default function PostHistoryCard({post}:{post:Project}){
    return(
    <div className="flex p-4 bg-white shadow rounded-lg hover:bg-sky-700 m-3">
      
            <Image
              src={post.postImages}
              alt={post.postName}
              width={0}
              height={0}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-4">
              <h3 className="font-bold">{post.postName}</h3>
              <p>Producer: {post.producer}</p>
              <p>SuccessDate: {post.endDate}</p>
              <p>Role: {post.postProjectRole}</p>
            </div>
   
      
    </div>)
}