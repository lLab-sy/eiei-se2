export interface PostData {
    postMediaTypeOut?: any;
    id?:string
    postName: string;
    postDescription: string;
    postImages?: string[];
    postImagesSend?: File[];
    postMediaType: string;
    postProjectRoles?: string[];
    postProjectRolesOut?: PostRolesResponse[]
    postStatus: string;
    startDate?: string; 
    endDate?: string;  
    userID: string;
    postImageDisplay?:PostImageDisplay[]
    participants?: Participant[]
}


export interface Participant{
    comment:string,
    createdAt:Date,
    offer:OfferData[],
    participantID?:string,
    // participants?:ParticipantDetail,
    ratingScore:string,
    reviewedAt?:Date,
    status: string,
    updatedAt: Date
    // --
    workQuota?:number,
    isSend?:boolean,
    isApprove?:boolean,
    submissions?:Date[]

}

export interface ParticipantForRight{
    comment:string,
    createdAt:Date,
    offer:OfferDataForRight[],
    participantID:ParticipantDetail,
    ratingScore:string,
    reviewedAt?:Date,
    status: string,
    updatedAt: Date
    // --
    workQuota?:number,
    isSend?:boolean,
    isApprove?:boolean,
    submissions:Date[]

}



export interface ParticipantDetail{
    _id:string,
    firstname:string,
    lastname:string,
    middlename:string
    username:string
}

export interface ApproveData{
    userId:string,
    isApprove:boolean
}

export interface PostImageDisplay{
    imageURL:string;
    imageKey:string;
}

export interface postMediaTypeOut{
    id:string;
    mediaName:string;
}

export interface ReceivedReview{
    reviewerName: string;
    reviewerProfileImage: string;
    ratingScore: number;
    comment: string;
    reviewAt: string;
}

export interface ReceivedReviews{
    receivedReviews: ReceivedReview[];
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

// export interface PostDataHistory {
//     id:string,
//     postName: string;
//     producerName: ProducerResponse;
//     postDescription: string;
//     postImages: string[];
//     postImagesKey?: string[];
//     participant?: ParticipantForRight;
//     postMediaType: string;
//     postProjectRolesOut?: PostRolesResponse[]
//     postProjectRolesOutProfessional?: PostRolesResponse
//     startDate: string; 
//     endDate: string;   
//     postProjectRoles: string[]; 
//     postStatus: string;
//     roleCount:number;
//     participant: Participant
// }

export interface Rating{
    ratingScore: number;
    comment: string;
}

export interface Professional{
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
    profileImage: string;
}

export interface MetaData{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ProfessionalsData{
    data: Professional[];
    meta: MetaData;
}

// export interface ProjectResponse {
//     status: string;
//     data: Project[];
//     message: string;
// }

export interface PostRolesResponse{
    roleName: string,
    id: string
}

export interface ProducerResponse{
    producerName: string,
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
    role?:string;
    roleID?:string;
    productionProfessionalID:string;
    offeredBy: Number;
    price: Number;
    reason: string;
    createdAt: Date;
    postID: string;
}

export interface OfferDataForRight{
    role:PostRolesResponse;
    roleID:PostRolesResponse;
    productionProfessionalID:string;
    offeredBy: Number;
    price: Number;
    reason: string;
    createdAt: Date;
    postID: string;
}

export interface OfferHistoryResponseData{
    _id:string,
    offers:OfferHistoryData
}

export interface OfferHistoryData{
    createdAt: string;
    currentWage?: Number;
    offeredBy: Number;
    postName:string;
    reason?:string;
    roleName: string;
    status: string;
    userName?:string;
    price?: Number;
    _id:string; //id ของ post
    detail?: string
}

export interface ReviewData{
    postID:string;
    ratingScore:number;
    comment:string;
    createdAt:Date;
}

export interface PostParticipant {
    id: string;
    label: string;
    isReview: boolean;
    value:string;
}

export interface ChangeParticipantStatus{
    postID: string;
    participantID: string;
    statusToChange: string;
}