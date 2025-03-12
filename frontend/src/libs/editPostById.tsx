import axios from "axios";
import { PostData } from "../../interface";

export default async function editPostById(
  postId: string,
  data: FormData,
  token: string
) {
  // 
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}`;
  console.log(apiUrl)
  try {
    const response = await axios.put(apiUrl, data, {
      withCredentials: true,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type" :  "multipart/form-data"

      }
    });

    if (!response) {
      throw new Error("Failed to edit post");
    }

    console.log("Post Edited Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
}
