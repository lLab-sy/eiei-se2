import axios from 'axios';

// const baseUrl = `http://localhost:1000/api/auth`;

export const createUser = async (data: { username: string; password: string; role: string }) => {

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`
        console.log(apiUrl)
       
        const res = await axios.post(apiUrl, data);
        return res; 
    } catch (error) {
        console.error("Create User Error:", error);
        throw new Error("Failed to create user");
    }
};