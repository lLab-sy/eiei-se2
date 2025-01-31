import mongoose, { Document, Schema } from 'mongoose';
import { IPostRole } from './postRoleModel';  
// import { IUser } from './user';  
// import { IOffer } from './Offer';  // 

export interface IPostDetail extends Document {
    postId: mongoose.Schema.Types.ObjectId
    CandidateDetail: Array<{
        RoleID: mongoose.Schema.Types.ObjectId
        CandidateID: mongoose.Schema.Types.ObjectId
    }>;
    // OfferDetail: Array<{  //Next Sprint
    //     RoleID: mongoose.Schema.Types.ObjectId
    //     OfferID: mongoose.Schema.Types.ObjectId
    // }>;
}

const postDetailSchema = new Schema<IPostDetail>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true,
    },
    CandidateDetail: [{
        RoleID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role', // Reference to the Role model
            required: true,
        },
        CandidateID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate', // Reference to the Candidate model
            required: true,
        }
    }],
    // OfferDetail: [{ //Next Sprint
    //     RoleID: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Role', // Reference to the Role model
    //         required: true,
    //     },
    //     OfferID: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Offer', // Reference to the Offer model
    //         required: true,
    //     }
    // }]
}, { timestamps: true });

const PostDetail = mongoose.model<IPostDetail>('postDetail', postDetailSchema, 'postDetails');
export default PostDetail;
