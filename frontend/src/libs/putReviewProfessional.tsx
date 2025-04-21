import axios from "axios";
import { ReviewData } from "../../interface";

export default async function putReviewProfessional(
  data: ReviewData,
  token: string,
  // pId: string,
  professionalId: string,
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/users/${professionalId}/addReview`;

  const response = await axios.put(apiUrl, data, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("INPUT", data, token, professionalId);

  if (!response) {
    throw new Error("Failed to submit professional review");
  }

  console.log("Professional Review Response", response);
  return response;
}