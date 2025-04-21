import axios from "axios";
import { PostParticipant } from "../../interface";

export default async function getPostParticipants(
  postId: string,
  token?: string,
) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/${postId}/participants`;
    console.log('login libbbbbbbbbbbb')
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get<{
      status: string;
      data: PostParticipant[];
      message: string;
    }>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Post Participants:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch post participants:", error);
    throw new Error("Failed to fetch post participants");
  }
}