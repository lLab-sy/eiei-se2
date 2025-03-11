// 6. src/components/PostDetail.tsx
import { PostData } from "../../interface";
import { Separator } from "./ui/separator";

interface PostDetailProps {
  postState: PostData | null;
  startDate: string;
  endDate: string;
}

export default function PostDetail({
  postState,
  startDate,
  endDate,
}: PostDetailProps) {
  return (
    <div className="w-[80%] h-[100%] rounded-3xl">
      <div className="p-5 flex flex-col shadow-lg border h-[100%] bg-white w-full rounded-lg">
        <span className="text-2xl w-full ml-5 font-bold">รายละเอียดโพสต์</span>
        <div className="px-5 flex justify-between mt-5">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">ชื่อโพสต์</span>
            <span>{postState?.postName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">วันที่เริ่ม</span>
            <span>{startDate=="Invalid Date"?"-":startDate}</span>
          </div>
        </div>
        <div className="px-5 flex justify-between mt-5">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">สถานะ</span>
            <span className="text-xl text-orange-400">
              {postState?.postStatus}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">วันที่สิ้นสุด</span>
            <span>{endDate=="Invalid Date"?"-":startDate}</span>
          </div>
        </div>
        <Separator className="mt-5" />
        <div className="p-6 mt-4 h-full rounded-lg">
          <span className="text-xl">รายละเอียดโพสต์</span>
          <div className="mt-2 w-full border h-[90%] rounded-xl bg-slate-50 p-5 overflow-auto">
            {postState?.postDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
