export interface PostData {
    id?:string
    postName: string;
    postDescription: string;
    postImages?: string[];
    postImagesSend?: File[];
    postMediaType: string;
    postProjectRoles: string[];
    postStatus: string;
    startDate?: string; 
    endDate?: string;  
    userID: string;
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

export interface Rating{
    ratingScore: number;
    comment: string;
}

export interface Professionals{
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
    description?: string;
    imageUrl?: string;
    ratingAvg?: number;
}

export interface MetaData{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ProfessionalsData{
    data: Professionals[];
    meta: MetaData;
}

export interface ProjectResponse {
    status: string;
    data: Project[];
    message: string;
}

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

export interface OfferData{
    paticipantID:string;
    price: Number;
    description: string;
    role: string;
}


export interface OfferHistoryData{
    roleName: string; //populate
    price: Number;
    offeredBy: Number;
    createdAt: string;
    detail: string
}

