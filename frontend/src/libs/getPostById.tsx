import axios from "axios";
import { PostData } from "../../interface";

export default async function getPostById(
  postId: string,
  token: string
): Promise<PostData> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data || response.data.status !== "success") {
      throw new Error("Failed to fetch post by ID");
    }

    console.log("Fetched Post Data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}
