import mongoose, { Date, Document, Schema } from 'mongoose';

export interface IPost extends Document {
    postName:string;
    postDescription:string;
    postImages: string[];
    postMediaType:string;
    postProjectRoles: string[];
    postStatus:'created'| 'in-progress'| 'success'|'cancel';
    startDate: Date;
    endDate: Date;
    postDetailID: mongoose.Schema.Types.ObjectId;
}

export const postSchema = new Schema<IPost>({
    postName: {
        type: String,
        required: [true, 'Post name is required'],
        trim: true,
        maxlength: [50, 'Post name cannot exceed 50 characters'],
    },
    postDescription: {
        type: String,
        required: [true, 'Post description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    postImages: {
        type: [String],  
        required: [true, 'At least one image is required'],
        default: [],
    },
    postMediaType: {
        type: String,
        required: [true, 'Post media type is required'],
    },
    postProjectRoles: {
        type: [String], // Now supports multiple roles
        required: true,
        default: [], // Ensures it's always an array
    },
    postStatus: {
        type: String,
        enum: ['created', 'in-progress', 'success', 'delete'],
        required: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    postDetailID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostDetail',  // Reference to PostDetail model
        // required: [true, 'Post detail ID is required'],
    }
},
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Post = mongoose.model<IPost>('postType', postSchema, 'postTypes');
export default Post;
