export interface PostData {
    id:string
    postName: string;
    postDescription: string;
    postImages?: string[];
    postMediaType: string;
    postProjectRoles: string[];
    postProjectRolesOut?: PostRolesResponse[]
    postStatus: string;
    startDate?: string; 
    endDate?: string;  
    userID: string;
}

export interface SearchPosts{
    data: PostData[];
    meta: MetaData;
}

export interface MetaData{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface PostDataHistory {
    id:string,
    postName: string;
    postDescription: string;
    postImages: string[];
    postMediaType: string;
    postProjectRolesOut?: PostRolesResponse[]
    startDate: string; 
    endDate: string;   
    postProjectRoles: string[]; 
    postStatus: string;
    roleCount:number;
}

export interface UserData{
    _id: string;
    username: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    occupation: string;
    skill: string[];
    experience: number;
    rating: Rating[];
    avgRating: number;
    description?: string;
    imageUrl?: string;
}

export interface Rating{
    ratingScore: number;
    comment: string;
}

// export interface Project {
//     id: string;
//     postName: string;
//     postDescription: string;
//     postImages: string[];
//     postMediaType: string;
//     postProjectRoles: string[];
//     postStatus: string;
//     startDate: string; 
//     endDate: string;    
// }

// export interface ProjectResponse {
//     status: string;
//     data: Project[];
//     message: string;
// }

export interface PostRolesResponse{
    roleName: string,
    id: string
}

export interface MediaTypesResponse{
    mediaName: string;
    id: string;
}

export interface imagePair {
    imgSrc: string
    imgFile: File
  }

export  interface RoleType{
    id: string; 
    roleName: string;
}
  
export interface MediaType{
    id: string;
    mediaName: string;
}
export interface OfferData{
    paticipantID:string;
    price: Number;
    description: string;
    role: string;
}

export interface OfferHistoryData{
    roleName: string; //populate
    price: Number;
    offerBy: Number;
    createdAt: string;
    detail: string
}

