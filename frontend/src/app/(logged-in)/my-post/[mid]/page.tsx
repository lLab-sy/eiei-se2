import MyPostContentDetail from "@/components/MyPostContentPanel";

// const mockMyPost :PostData= {
//     id:"67alk6884lop",
//     postName: "PNak Prakanong",
//     postDescription: "Thai Movie in 2010s",
//     postImages: ["1","2","3"], 
//     postMediaType: "Movie",
//     postProjectRolesOut:[{roleName:"Actor",id:"67xxxxx"}] ,
//     postStatus: "created",
//     startDate:"14-02-2568" ,
//     endDate: "14-03-2568", 
//     userID: "67xxxxxx",
//     postImageDisplay:[{imageKey:"4a5dfds",imageURL:"aws.picture.com"}],
//     participants: [
//         {
//             comment:"",
//             createdAt:"14-02-2568",
//             offer:[],
//             participantID:"xxxx", //เอา firstName ออกมา
//             ratingScore:0,
//             status:"candidate",
//             updatedAt:"14-02-2568",
//             reviewedAt:""
//             isSend=true,
//             workQuota=3,
//             isApprove=true
//         }
//     ]
// }



export default function MyPostContentPage(){   
    return(
        <main className="min-h-screen bg-white-50">
           <MyPostContentDetail/>
        </main>
    )
}