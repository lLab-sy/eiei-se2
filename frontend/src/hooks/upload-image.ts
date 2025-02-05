import AxiosInstance from "@/lib/axiosInstance";

type Param = {
  imageFiles: File[];
  token: string;
};

export default async function uploadImage({ imageFiles, token }: Param) {
  const formData = new FormData();

  imageFiles.forEach((file, _ ) => {
    formData.append(`imageFiles`, file); // Appending files to FormData
  });

  const response = await AxiosInstance.post("/api/v1/upload", formData, {
    headers: {
      'Content-Type': "multipart/form-data",
      'Authorization': `Bearer ${token}`,
    },
  }); // expect response.data is array of String (like postImages in postDTO)
  if (response.status !== 201) {
    return null;
  }

  return response.data;
}