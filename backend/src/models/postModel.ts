import mongoose, { Date, Document, Schema } from 'mongoose';

export interface IPost extends Document {
    postName:string;
    postDescription:string;
    postImages: string[];
    postMediaType:string;
    postProjectRoles: mongoose.Schema.Types.ObjectId[]; // Updated type
    postStatus:'created'| 'in-progress'| 'success'|'cancel';
    startDate: string;
    endDate: string;
    postDetailID: mongoose.Schema.Types.ObjectId;
    userID: mongoose.Schema.Types.ObjectId;
}

export const postSchema = new Schema<IPost>({
    postName: {
        type: String,
        required: [true, 'Post name is required'],
        trim: true,
        minlength:[4,"Please name the post more than 4 characters"],
        maxlength: [50, 'Post name cannot exceed 50 characters'],
    },
    postDescription: {
        type: String,
        required: [true, 'Post description is required'],
        minlength:[50,"Please name the post more than 4 characters"],
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    postImages: {
        type: [String],  
        required: [true, 'At least one image is required'],
        validate: {
            validator: function (postImages: mongoose.Schema.Types.ObjectId[]) {
                return postImages.length > 0; // Ensures the array is not empty
            },
        message: "Post Images roles cannot be empty"
        }
    },
    postMediaType: {
        type: String,
        required: [true, 'Post media type is required'],
    },
    postProjectRoles: 
        {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'postRoleType', // Reference to the Role model
        required: [true,"require post project roles"],
        validate: {
            validator: function (roles: mongoose.Schema.Types.ObjectId[]) {
                return roles.length > 0; // Ensures the array is not empty
            },
            message: "Post project roles cannot be empty"
        }
        }
    ,
    postStatus: {
        type: String,
        enum: ['created', 'in-progress', 'success', 'delete'],
            required: true,
    },
    startDate: {
        type: String,
        // required: [true, 'Start date is required'],
    },
    endDate: {
        type: String,
        
    },
    postDetailID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostDetail',  // Reference to PostDetail model
        // required: [true, 'Post detail ID is required'],
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to User model
        required: [true]
    }
},
    { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create a text index on specific fields
postSchema.index({ postName: 1, postDescription: 1});

const Post = mongoose.model<IPost>('postType', postSchema, 'postTypes');
export default Post;

//  for post search query
export interface PostSearchQuery {
    $text?: { $search: string };
    postMediaType?: { $in: string[] };
    postProjectRoles?: { $all: string[] };
}

export interface PostSearchRequestModel {
    searchText?: string;
    postMediaTypes?: string[];
    roleRequirements?: string[];
    limit?: number;
    page?: number;
}

export interface PostSearchResponse {
    data: IPost[],
    totalItems: number
}