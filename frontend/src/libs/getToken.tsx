import { cookies } from "next/headers";
interface tokenObject {
    name : string,
    value : string
}
export default async function getTokenObjectServer() : Promise<tokenObject>{
    const cookieStore = await cookies()
    if(!cookieStore.get('token')){
        return {
            name : '',
            value : ''
        }
    }
    return cookieStore.get('token') ?? {
        name : '',
        value : ''
    }
}
