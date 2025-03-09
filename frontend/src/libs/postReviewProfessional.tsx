// src/libs/submitPostReview.ts
import axios from "axios";
import { ReviewData } from "../../interface";

/**
 * ส่งรีวิวโพสต์จาก Production Professional
 *
 * @param reviewData ข้อมูลรีวิว
 * @param token token สำหรับการยืนยันตัวตน
 * @returns response จาก API
 */
export default async function submitPostReview(
  reviewData: ReviewData,
  token: string,
) {
  console.log("Review Data:", reviewData);

  // ตรวจสอบว่ามีข้อมูลที่จำเป็น
  if (!reviewData.ratingScore || !reviewData.comment) {
    throw new Error("Missing required fields: ratingScore and comment");
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${reviewData.postID}/addReview`;

  // สร้าง request body ตามที่ API ต้องการ
  const requestBody = {
    ratingScore: reviewData.ratingScore,
    comment: reviewData.comment,
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Post Review Response:", response);
    return response;
  } catch (error) {
    console.error("Error submitting post review:", error);
    throw error;
  }
}
