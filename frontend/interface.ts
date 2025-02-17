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

export interface Project {
    id: string;
    postName: string;
    postDescription: string;
    postImages: string[];
    postMediaType: string;
    postProjectRoles: string[];
    postStatus: string;
    startDate: string; 
    endDate: string;    
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
    mediaName: string,
    id: string
}

export interface imagePair {
    imgSrc: string
    imgFile: File
  }