import axios from "axios"

export interface SentTransferData{
    fullName: string,
    bankAccount: {
        name: string,
        number: string,
        brand: string
    }
}

export default async function postCustomerTransfer(data: SentTransferData, token: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/transfer/create-customer`;
    console.log("data", data);
    const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response) {
        throw new Error("Failed to create customer transfer");
    }

    console.log("Hello Create customer", response);
    return response.data;
}