export interface PostData {
    postname: string;
    postdescription: string;
    postmediatype: string;
    postProjectRole: string;
    poststatus: string;
    file: string;  // Base64 encoded file data
}

export interface Project {
    id: number;
    postName: string;
    postDescription:string;
    postImages:string;
    postMediaType:string;
    postProjectRole:string;
    postStatus:string;
    startDate: string
    endDate: string;

    producer: string; //AuthMe
  }
  