import { PostData } from "../../interface";

interface postContent {
  postName: string;
  postMediaType: string;
  userID: string;
  postStatus: string;
}

export default function PostToOffer({
  post,
  userRole,
}: {
  post: PostData;
  userRole?: string;
}) {
  const mockPost: postContent = {
    postName: "PostName",
    postMediaType: "postMediaType",
    userID: "userID",
    postStatus: "postStatus",
  };
  const offerDateStart = new Date(post?.startDate ?? "");
  const startDate = offerDateStart.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const offerDateEnd = new Date(post?.endDate ?? "");
  const endDate = offerDateEnd.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ข้อมูลจำลองสำหรับ Producer
  const applicantsCount = (post?.participants).length; // จำนวนผู้สมัครทั้งหมด (สำหรับตัวอย่าง)
  const offersCount = 3; // จำนวนข้อเสนอ (สำหรับตัวอย่าง)

  return (
    <div className="hover:bg-slate-50 flex h-[100px] mx-[5%]">
      <div
        className={`w-[1%] ${post.postStatus === "created" ? "bg-lime-400" : "bg-red-400"}`}
      ></div>
      <div className="border flex items-center w-full justify-around">
        <span>{`${post.postName}`}</span>
        <span>{`Status: ${post.postStatus}`}</span>
        <span>{`Start: ${startDate}`}</span>
        <span>{`End: ${endDate}`}</span>

        {/* ข้อมูลเพิ่มเติมสำหรับ Producer */}
        {userRole === "producer" && (
          <>
            <span className="flex flex-col items-center">
              <span className="text-lg font-semibold">{applicantsCount}</span>
              <span className="text-xs text-gray-500">ผู้สมัคร</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="text-lg font-semibold">{offersCount}</span>
              <span className="text-xs text-gray-500">ข้อเสนอ</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
