import Image from "next/image";
import { PostDataHistory } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";
 
 

export default function PostHistoryCard({ post,userName,role }: { post: PostDataHistory, userName:string, role:string }) {
  const endDateDayJS = new Date(post.endDate)
  const EndDate = endDateDayJS.toDateString();

  const startDateDayJS = new Date(post.endDate)
  const StartDate = startDateDayJS.toDateString();


  return (
    <main className="group relative bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-mainblue opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex m-auto">
        {/* <div className="relative rounded-lg overflow-hidden flex-shrink-0"> */}
          <Image
            src={`${post.postImages[0]}`}
            alt={post.postName}
            width={parent.innerWidth}
            height={parent.innerHeight}
            className="object-cover w-[40%] h-[50%] rounded-lg"
          />
        {/* </div> */}
        <div className="ml-6 flex-1 w-[60%] m-auto">
          <h3 className="text-xl font-semibold text-mainblue mb-2 group-hover:text-mainblue-light transition-colors">
            {post.postName}
          </h3>
          {role === "producer" ? (
              // Producer View
              <>
                <div className="flex items-center text-gray-600">
                  <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Type: {post.postMediaType}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Roles: {post.postProjectRoles.join(', ')}
                  </p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">
                    Period: {StartDate} - {EndDate}
                  </p>
                </div>
              </>
            ) : (
              // Production Professional View
              <>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Producer: {post?.producerName?.producerName}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Role: {post?.postProjectRolesOutProfessional?.roleName}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Completed: {EndDate}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
  );
}
function dayjs(endday: Date) {
  throw new Error("Function not implemented.");
}

