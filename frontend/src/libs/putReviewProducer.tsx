// src/libs/submitProfessionalReview.ts

import axios from "axios";
import { ReviewData } from "../../interface";

/**
 * ส่งรีวิวให้กับ Production Professional โดย Producer
 *
 * @param professionalId ID ของ Production Professional ที่ต้องการรีวิว
 * @param reviewData ข้อมูลรีวิว
 * @param token token สำหรับการยืนยันตัวตน
 * @returns response จาก API
 */
export default async function submitProfessionalReview(
  professionalId: string,
  reviewData: ReviewData,
  token: string,
) {
  console.log("Review Data:", reviewData);
  console.log("Professional ID:", professionalId);

  // ตรวจสอบว่ามีข้อมูลที่จำเป็น
  if (!reviewData.ratingScore || !reviewData.comment || !reviewData.postID) {
    throw new Error(
      "Missing required fields: ratingScore, comment, and postID",
    );
  }

  if (!professionalId) {
    throw new Error("Missing required field: professionalId");
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${professionalId}/addReview`;

  // สร้าง request body ตามที่ API ต้องการ
  const requestBody = {
    postID: reviewData.postID,
    ratingScore: reviewData.ratingScore,
    comment: reviewData.comment,
  };

  try {
    const response = await axios.put(apiUrl, requestBody, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Professional Review Response:", response);
    return response;
  } catch (error) {
    console.error("Error submitting professional review:", error);
    throw error;
  }
}
