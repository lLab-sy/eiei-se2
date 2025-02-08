import EditPostPage from "@/components/EditPostPage";

export default function Page({ params }: { params: { postId: string } }) {
  console.log("Params:", params);

  if (!params || !params.postId) {
    return <p>Loading..</p>; // กรณี params ยังไม่โหลด
  }
  return <EditPostPage initialPostId={params.postId} />;
}
