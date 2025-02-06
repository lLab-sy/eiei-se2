import Image from "next/image";
import { Project } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";

export default function PostHistoryCard({ post }: { post: Project }) {
  return (
    <div className="group relative bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-mainblue opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex p-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          {/* <Image
            src={""}
            alt={post.postName}
            width={0}
            height={0}
            fill
            className="object-cover"
          /> */}
        </div>
        <div className="ml-6 flex-1">
          <h3 className="text-xl font-semibold text-mainblue mb-2 group-hover:text-mainblue-light transition-colors">
            {post.postName}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <p className="text-sm">{post.id}</p>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <p className="text-sm">{post.endDate}</p>
            </div>
            <div className="flex items-center text-gray-600">
              <Film className="w-4 h-4 mr-2" />
              <p className="text-sm">{post.postProjectRoles}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
