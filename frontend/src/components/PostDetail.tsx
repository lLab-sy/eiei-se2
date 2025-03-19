// 6. src/components/PostDetail.tsx
import Image from "next/image";
import { PostData } from "../../interface";
import { Separator } from "./ui/separator";

interface PostDetailProps {
  postState: PostData | null;
  startDate: string;
  endDate: string;
  postImageState : string;
  currentOfferStatus : string;
}

export default function PostDetail({
  postState,
  startDate,
  endDate,
  postImageState,
  currentOfferStatus,
}: PostDetailProps) {
  return (
    <div className="md:w-[80%] lg:text-lg md:text-md text-sm w-[320px] h-[100%] rounded-3xl">
      <div className="p-5 flex flex-col shadow-lg border h-[100%] bg-white w-full rounded-lg">
        <span className="flex text-2xl w-full ml-5 font-bold "><span className='w-[50%]'>Post Detail</span><span className='text-lg self-end'>{`Status: ${currentOfferStatus}`}</span></span>
        <div className='flex justify-around'>
          <div className='w-[320px] h-[320px] mt-5 rounded-lg bg-slate-50 shadow-xl'>
              <img className='w-full rounded-lg h-full' alt='No Image' src={(!postImageState) ? "/" :postImageState} />
          </div>
          <div className='w-[50%]'>
            <div className="px-5 flex justify-between mt-5">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Post Name</span>
                <span>{postState?.postName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span>{startDate}</span>
              </div>
            </div>
            <div className="px-5 flex justify-between mt-5">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Post Status</span>
                <span className="text-xl text-orange-400">
                  {postState?.postStatus}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">End Date</span>
                <span>{endDate}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-5" />
        <div className="p-6 mt-4 h-full rounded-lg">
          <span className="text-xl">Post Description</span>
          <div className="mt-2 w-full border h-[90%] rounded-xl bg-slate-50 p-5 overflow-auto">
            {postState?.postDescription}
          </div>
        </div>
      </div>
    </div>
  );
}