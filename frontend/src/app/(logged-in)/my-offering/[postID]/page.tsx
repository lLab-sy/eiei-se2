"use client";

import MyPostDetail from "@/components/MyPostDetail";
import ProductionWorkingContent from "@/components/ProductionWorkingContent";
import { useParams } from "next/navigation";
import { PostData } from "../../../../../interface";

const MyOffering = () => {
    const { postID }: { postID: string } = useParams();
    let post: PostData = {
        id: postID,
        postName: "Sample Post",
        postDescription: "This is a sample post description.",
        postImages: [],
        postImagesSend: [],
        postMediaType: "image",
        postProjectRoles: ["Role1", "Role2"],
        postProjectRolesOut: [],
        postStatus: "success",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        userID: "user123",
        postImageDisplay: [],
        participants: []
    };

    return(
        <main className="min-h-screen bg-white-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 my-5 h-full flex-auto">
            <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                <MyPostDetail post={post}/>
            </div>
            <div className="col-span-1 w-[80%] lg:w-[95%] m-auto h-[650px] my-5 flex">
                <ProductionWorkingContent/>
            </div>
        </div>
        </main>
    );
}

export default MyOffering;