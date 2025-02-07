import Image from "next/image";
import { Project } from "../../interface";
import { Clock, Calendar, User, Film } from "lucide-react";

export default function PostHistoryCard({
  post,
  role,
}: {
  post: Project;
  role: string;
}) {
  return (
    <div className="group relative bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-mainblue opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex p-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={post.postImages}
            alt={post.postName}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-6 flex-1">
          <h3 className="text-xl font-semibold text-mainblue mb-2 group-hover:text-mainblue-light transition-colors">
            {post.postName}
          </h3>

          <div className="space-y-2">
            {role === "producer" ? (
              // Producer View
              <>
                <div className="flex items-center text-gray-600">
                  <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Type: {post.postMediaType}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Needed: {post.postProjectRole}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">
                    Period: {post.startDate} - {post.endDate}
                  </p>
                </div>
              </>
            ) : (
              // Production Professional View
              <>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Producer: {post.producer}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Film className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Role: {post.postProjectRole}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-mainblue-light" />
                  <p className="text-sm">Completed: {post.endDate}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
