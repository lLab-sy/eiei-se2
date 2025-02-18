// frontend/src/libs/getHistoryPosts.tsx

import axios from "axios";

export default async function getHistoryPosts(token: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/posts/user`;
  const response = await axios.get(apiUrl, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response) {
    throw new Error("Falied to fetch post history");
  }
  // const result =await response.json()
  console.log("Hello Fetch Post History", response);
  return await response;
}
