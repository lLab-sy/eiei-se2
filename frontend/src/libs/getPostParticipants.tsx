import axios from "axios";
import { PostParticipant } from "../../interface";

export default async function getPostParticipants(postId: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}/participants`;
    const response = await axios.get<{
      status: string;
      data: PostParticipant[];
      message: string;
    }>(apiUrl);
    console.log("Post Participants:", response);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch post participants:", error);
    throw new Error("Failed to fetch post participants");
  }
}
