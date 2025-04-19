import axios from "axios";

export default async function postProfessionalTransfer(postID: string, amount: number, token: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transfer/transfer`;

    const response = await axios.post(apiUrl, {postId: postID, amount: amount}, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response) {
        throw new Error("Failed transfer");
    }

    console.log("Hello Create customer", response);
    return response.data;
}