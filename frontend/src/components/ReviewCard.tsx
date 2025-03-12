import React from "react";
import Image from "next/image";
import {Star} from "lucide-react";

interface ReceivedReviewCradProp {
    index: number;
    reviewerName: string;
    reviewerProfileImage: string;
    ratingScore: number;
    comment: string;
}

const PostCrad: React.FC<ReceivedReviewCradProp> = ({
    index,
    reviewerName,
    reviewerProfileImage,
    ratingScore,
    comment
}) => {
    return (
        <div key={index} className="border-b py-4">
        <div className="flex items-center gap-4">
          <Image src={reviewerProfileImage == '' ? '/image/logo-preview.png' : reviewerProfileImage} alt={reviewerName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
          <div>
            <p className="font-semibold">{reviewerName}</p>
            <div className="flex">
              {[...Array(Math.round(ratingScore))].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 text-gray-700">{comment}</p>
      </div>
    );
};

export default PostCrad;
