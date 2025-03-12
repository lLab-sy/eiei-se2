import { Rating } from "@mui/material";
import { User } from "lucide-react";
import { reviewInterface } from "./ReviewProfessional";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function ReviewContent({data, rating} : {data : reviewInterface, rating : number}) {

  
  const date2: Date = new Date();
  const date1: Date = new Date(data.reviewAt);
  const diffTime: number = date2.getTime() - date1.getTime();
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  console.log("Reviewdata", data)
  return (
    <div className="flex flex-col p-3 my-2 w-[97%] bg-slate-50 rounded-lg">
      <div className="flex justify-between">
        <div className='flex'>
          {
            (!data?.producerProfileImage) ?
            <User size={48}/> : 
            <Avatar className='mr-2'>
              <AvatarImage src={data?.producerProfileImage}/>
            </Avatar>
            // <Image width={10} height={10} src={data?.producerProfileImage} alt=''/>
          }
          
          <div className='flex flex-col'>
            <span className='text-sm'>{`${data.producer} (${data.postName})`}</span>
            <Rating
              size="small"
              readOnly
              name="half-rating"
              value={rating}
              precision={1}
            />
          </div>
        </div>
        <span className=''>
          {`${diffDays} day ago`}
        </span>
      </div>
      <span className="text-wrap ">
        {data.comment}
      </span>
    </div>
  );
}
