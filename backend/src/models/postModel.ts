import mongoose, { Document, Schema } from 'mongoose';
import { bool } from 'sharp';

// Offer History Model
export interface OfferHistory {
    role: mongoose.Schema.Types.ObjectId; // Role offered to the participant
    offeredBy: number; // User ID should be better than 0/1 ? 0,1 beacaus I'm Rock
    price: number; // The amount offered for the role
    reason: string;
    createdAt: Date; // Date when the offer was created
}

export interface PaticipantRating {
    ratingScore: number;
    comment: string; 
    reviewedAt: Date|null; // Date of review for the participant
}

// Participant Detail Model
export interface ParticipantDetail {
    participantID: mongoose.Schema.Types.ObjectId; // Production Professional ID
    status: 'candidate' | 'reject' | 'in-progress'; // Participant status
    offer: OfferHistory[]; // Array of offer history for the participant
    ratingScore: number;
    comment: string; 
    reviewedAt: Date|null; // Date of review for the participant

    workQuota: number|3;
    isSend: boolean|false;
    isApprove: boolean|false;
    submissions: Date[];

    createdAt: Date; // Date participant was first added (when first offer was made)
    updatedAt: Date; // Date when participant details were last updated
}

// Main Post Model
export interface IPost extends Document {
    postName: string;
    postDescription: string;
    postImages: string[];
    postMediaType: mongoose.Schema.Types.ObjectId;
    postProjectRoles: mongoose.Schema.Types.ObjectId[]; 
    postStatus: 'created' | 'waiting' | 'in-progress' | 'success' | 'cancel';
    startDate?: string;
    endDate?: string;
    postDetailID: mongoose.Schema.Types.ObjectId;
    userID: mongoose.Schema.Types.ObjectId;
    participants: Array<ParticipantDetail>;
}

const offerHistorySchema = new Schema<OfferHistory>({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postRoleType',
        required: true,
    },
    offeredBy: {
        type: Number,
        ref: 'user',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reason:{
        type: String,
        required:true
    }
}, { _id: false });

export const participantDetailSchema = new Schema<ParticipantDetail>({
    participantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['candidate', 'reject', 'in-progress'],
        required: true,
    },
    offer: [offerHistorySchema], // Array of offer history for the participant
    ratingScore: {
        type: Number,
        min: 0,
        max: 5,
        required: false,
    },
    comment: {
        type: String,
        default: '',
        //required: true,
    },
    reviewedAt: {
        type: Date,
    },

    workQuota: {
        type: Number,
        default: 3,
    },
    isSend: {
        type: Boolean,
        default: false,
    },
    isApprove: {
        type: Boolean,
        default: false,
    },
    submissions: {
        type: [Date],
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { _id: false });

const postSchema = new Schema<IPost>({
    postName: {
        type: String,
        required: [true, 'Post name is required'],
        trim: true,
        minlength: [4, "Please name the post more than 4 characters"],
        maxlength: [50, 'Post name cannot exceed 50 characters'],
    },
    postDescription: {
        type: String,
        required: [true, 'Post description is required'],
        minlength: [50, "Please name the post more than 4 characters"],
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    postImages: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function (postImages: mongoose.Schema.Types.ObjectId[]) {
                return postImages.length > 0; // Ensures the array is not empty
            },
            message: "Post Images roles cannot be empty",
        },
    },
    postMediaType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mediaType',
        required: [true, 'Post media type is required'],
    },
    postProjectRoles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'postRoleType', // Reference to the Role model
        required: [true, "Post project roles are required"],
        validate: {
            validator: function (roles: mongoose.Schema.Types.ObjectId[]) {
                return roles.length > 0; // Ensures the array is not empty
            },
            message: "Post project roles cannot be empty",
        },
    },
    postStatus: {
        type: String,
        enum: ['created', 'in-progress', 'success', 'cancel'],
        required: true,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    postDetailID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postDetail',
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    participants: [participantDetailSchema],
}, { timestamps: true });

// Create a text index on specific fields for search
postSchema.index({ postName: 1, postDescription: 1 });

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

export interface GetOfferRequestModel {
    userId?: string;
    postId?: string;
    postStatus?: string;
    limit?: number;
    page?: number;     
}

export interface OfferHistoryForGetOfferResponse {
    _id: string;
    userName:string;
    postName: string;
    roleName: string; // Role offered to the participant
    currentWage: number; // The amount offered for the role
    reason: string;
    offeredBy: number; // User ID should be better than 0/1 ?
    status: string;
    createdAt: Date; // Date when the offer was created
}

export interface GetOfferResponse {
    data: OfferHistoryForGetOfferResponse[],
    totalItems: number
}

export interface GetPostByProfRequestModel {
    userId: string;
    postStatus: string;
    limit: number;
    page: number;
    postMediaTypes: string[];
    searchText: string;
    participantStatus:string;
}

export interface GetPostByProducerRequestModel {
    userId: string;
    postStatus: string;
    limit: number;
    page: number;
    postMediaTypes: string[];
    searchText: string;
}

export interface SendApproveRequestModel {
    postId: string;
    userId: string;
    isApprove: boolean;
}

export interface GetPostByProfResponse {
    data: IPost[];
    totalItems: number;
}

export interface GetOfferRequestModel {
    userId?: string;
    postId?: string;
    postStatus?: string;
    limit?: number;
    page?: number;     
}