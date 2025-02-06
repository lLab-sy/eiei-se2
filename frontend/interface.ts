export interface PostData {
    postname: string;
    postdescription: string;
    postmediatype: string;
    postProjectRole: string;
    poststatus: string;
    file: string;  // Base64 encoded file data
}

export interface Project {
    id: string;
    postName: string;
    postDescription: string;
    postImages: string[];
    postMediaType: string;
    postProjectRoles: string[];
    postStatus: string;
    startDate: string; // ISO Date string
    endDate: string;   // ISO Date string
}

export interface ProjectResponse {
    status: string;
    data: Project[];
    message: string;
}
