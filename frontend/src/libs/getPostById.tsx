import axios from "axios";

interface IpostProjectRolesOut{
  id:string;
  roleName:string;
}

interface IpostImageDisplay{
  imageURL:string;
  imageKey:string;
}

interface PostResponse {
  id: string;
  postName: string;
  postDescription: string;
  postImages: string[];
  postMediaType: string;
  //postProjectRoles: string[];
  postProjectRolesOut: IpostProjectRolesOut[];
  postImageDisplay: IpostImageDisplay[];
  postImagesKey: string[];
  postStatus: string;
  userID: string;
  startDate: string;
  endDate: string;
}

export default async function getPostById(
  postId: string,
  token: string
){
  // console.log(postId,token)
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/v1/posts/${postId}`;

  try {
    const response = await axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data || response.data.status !== "success") {
      return null
    }

    console.log("Hello Fetched Post Data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}
