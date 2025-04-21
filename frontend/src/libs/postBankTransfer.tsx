import axios from "axios"

export default async function postBankTransfer(postID: string, token: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/transfer/transfer`;

    const response = await axios.post(apiUrl, {postID: postID}, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response) {
        throw new Error("Failed to transfer");
    }

    console.log("Hello transfer", response);
    return response.data;
}