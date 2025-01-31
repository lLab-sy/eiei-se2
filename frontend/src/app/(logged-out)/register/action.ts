import axios from 'axios';

const baseUrl = `http://localhost:1000/api/auth`;

export const createUser = async (data: { username: string; password: string; role: string }) => {

    try {
        const res = await axios.post(`${baseUrl}/register`, data);
        return res; 
    } catch (error) {
        console.error("Create User Error:", error);
        throw new Error("Failed to create user");
    }
};