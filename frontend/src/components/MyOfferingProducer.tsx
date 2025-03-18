"use client";

import MyPostDetail from "@/components/MyPostDetail";
import ProductionWorkingContent from "@/components/ProducerWorkingContent";
import { useParams } from "next/navigation";
import { PostData } from "../../interface";

const MyOfferingProducer = () => {
    const { postID }: { postID: string } = useParams();

    return(
        <div className="">
                <ProductionWorkingContent/>
        </div>
    );
}

export default MyOfferingProducer;