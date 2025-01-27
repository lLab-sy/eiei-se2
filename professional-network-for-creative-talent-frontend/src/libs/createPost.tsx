import { PostData } from "../../interface";

export default async function createPost(formData: FormData) {
    // console.log(`${process.env.BACKEND_URL}/api/v1/posts`)
    const response = await fetch(`http://localhost:5000/api/v1/posts`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to upload the post.");
    }

    return await response.json();
}