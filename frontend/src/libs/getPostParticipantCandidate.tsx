import axios from "axios";
import { Participant, ParticipantForRight, PostParticipant } from "../../interface";

export default async function getPostParticipantCandidate(
  postId: string,
  token?: string,
) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/getPostParticipant/${postId}`;
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get<{
      status: string;
      data: ParticipantForRight[];
      message: string;
    }>(apiUrl,{  headers: {
        Authorization: `Bearer ${token}`,
      },});
    if(!response){
        throw new Error("Falied to fetch his/her participant on right")
    }
    if (!response.data || response.data.status !== "success") {
        throw new Error("Failed to fetch offer");
      }
    console.log("Hello Participants On right", response.data);
    return response.data.data;
    
  } catch (error) {
    console.error("Failed to fetch post participants:", error);
    throw new Error("Failed to fetch post participants");
  }
}