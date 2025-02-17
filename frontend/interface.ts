export interface PostData {
    postName: string;
    postDescription: string;
    postImages?: string[];
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
    postProjectRoles?: string[];
    postProjectRolesOut?: PostRolesResponse[]
    postStatus: string;
    startDate: string; 
    endDate: string;   
    postProjectRoles: string[]; 
    postStatus: string;
    roleCount:number;
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

