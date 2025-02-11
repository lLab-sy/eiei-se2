// DisplayPostPage.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const mockPost = {
  id: "1",
  postname: "Help Required",
  description: "I'm making a short film.",
  type: "short",
  roles: ["Producer", "Camera Operator"],
  images: [
    "/image/logo.png",
    "/image/mock1.png",
    "/image/mock2.png",
  ],
};

export default function DisplayPostPage() {
  const router = useRouter();

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle className="justify-center flex">Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-bold">{mockPost.postname}</h2>
            <p className="text-gray-600">{mockPost.description}</p>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Media Type</h3>
              <p>{mockPost.type}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Roles Required</h3>
              <ul>
                {mockPost.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Images</h3>
              <div className="flex space-x-4">
                {mockPost.images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Post image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => router.push(`/edit-post/${mockPost.id}`)}>
                Edit Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
