import { Avatar, AvatarImage } from "./ui/avatar";

export default function AvatarProfileImage({token, user} : {token : string, user : any}){
    return(
        <Avatar>
            <AvatarImage src={((!token) || user?.profileImageURL)} width={50} height={50} loading="lazy"/>
        </Avatar>
    )
}