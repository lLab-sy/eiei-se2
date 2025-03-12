import axios from "axios";
import { ReviewData } from "../../interface";

export default async function postReviewPost(
  data: ReviewData,
  token: string,
  postId: string,
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/${postId}/addReview`;

  const response = await axios.post(apiUrl, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response) {
    throw new Error("Failed to submit post review");
  }

  console.log("Post Review Response", response);
  return response;
}