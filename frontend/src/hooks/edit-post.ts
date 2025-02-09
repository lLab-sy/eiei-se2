import AxiosInstance from "@/lib/axiosInstance";

type postData = {
  postProjectRoles: string[];
  postName: string;
  postMediaType: string;
  postDescription: string;
  postImages: string[]; // สมมติว่าเก็บ URL หรือ Base64 ของรูปภาพ
};

type param = {
  postId: string; // เพิ่ม postId เพื่อระบุโพสต์ที่จะแก้ไข
  postData: postData;
  token: string;
};

export default async function editPost({ postId, postData, token }: param) {
  try {
    const response = await AxiosInstance.put(
      `/api/v1/posts/${postId}`, // ใช้ HTTP PUT เพื่ออัปเดตโพสต์
      {
        postData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
