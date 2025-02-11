import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL //please create an .env file with the needed info (ref. example.env)
})

export default AxiosInstance;