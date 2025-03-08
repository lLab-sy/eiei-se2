import { IsString, IsNotEmpty, MaxLength, IsEnum, IsArray, ArrayNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
class PostProjectRoleDTO {
    @ApiProperty({ description: 'Role ID', type: String })
    id!: string;

    @ApiProperty({ description: 'Role name', type: String })
    roleName!: string;
}

export interface ImageDisplayDTO{
    imageURL: string;
    imageKey: string;
}

export interface PaticipantRatingDTO {
    ratingScore: number;
    comment: string; 
    reviewedAt: Date|null; // Date of review for the participant
}

export interface OfferDTO{ //ซ้ำกับบูม
    role: string;
    price: number;
    offeredBy: number;
    createdAt: Date;
    reason: string;
}

export interface OfferDetailDTO{
    role: ObjectId;
    price: number;
    offeredBy: number;
    createdAt: Date;
    reason: string;
}

export class ParticipantDetailDTO {  
    @ApiProperty({ description: 'Unique identifier of the participant', type: String })
    @IsString()
    @IsNotEmpty()
    participantID!: string;

    @ApiProperty({ description: 'Current status of the participant', enum: ['candidate', 'reject', 'in-progress'] })
    @IsString()
    @IsEnum(['candidate', 'reject', 'in-progress'], { message: 'Status must be one of: candidate, reject, in-progress' })
    status!: 'candidate' | 'reject' | 'in-progress';

    @ApiProperty({ description: 'Role ID associated with the participant', type: String })
    @IsString()
    @IsNotEmpty()
    roleID!: string;

    @ApiProperty({ description: 'User ID of the offer creator', type: Number })
    @IsNumber()
    @IsNotEmpty()
    offeredBy!: number;

    offer!: OfferDTO[]; // Array of offers received by the participant

    @ApiProperty({ description: 'Participant rating score', type: Number })
    @IsNumber()
    @IsNotEmpty()
    ratingScore!: number;

    @ApiProperty({ description: 'Comments about the participant', type: String })
    @IsString()
    @IsNotEmpty()
    comment!: string;

    @ApiProperty({ description: 'Date of the last review', type: Date, nullable: true })
    reviewedAt!: Date | null;

    @ApiProperty({ description: 'The offered price', type: Number })
    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @ApiProperty({ description: 'Date when the participant was first added', type: Date })
    createdAt!: Date;

    @ApiProperty({ description: 'Reason for the offer', type: String })
    @IsString()
    @IsNotEmpty()
    reason!: string;

    @ApiProperty({ description: 'Last update timestamp', type: Date })
    updatedAt!: Date;

    constructor(init?: Partial<ParticipantDetailDTO>) {
        Object.assign(this, init);
    }
}

export class ParticipantDetailInPostDTO {  
    @ApiProperty({ description: 'Unique identifier of the participant', type: String })
    @IsNotEmpty()
    participantID!: ObjectId;

    @ApiProperty({ description: 'Current status of the participant', enum: ['candidate', 'reject', 'in-progress'] })
    @IsString()
    @IsEnum(['candidate', 'reject', 'in-progress'], { message: 'Status must be one of: candidate, reject, in-progress' })
    status!: 'candidate' | 'reject' | 'in-progress';

    @ApiProperty({ description: 'Participant rating score', type: Object })
    @IsObject()
    offer!: OfferDetailDTO[]; // Array of offers received by the participant

    @ApiProperty({ description: 'Participant rating score', type: Number })
    @IsNumber()
    @IsNotEmpty()
    ratingScore!: number;

    @ApiProperty({ description: 'Comments about the participant', type: String })
    @IsString()
    @IsNotEmpty()
    comment!: string;

    @ApiProperty({ description: 'Date of the last review', type: Date, nullable: true })
    reviewedAt!: Date | null;

    @ApiProperty({ description: 'Date when the participant was first added', type: Date })
    createdAt!: Date;

    @ApiProperty({ description: 'Last update timestamp', type: Date })
    updatedAt!: Date;

    constructor(init?: Partial<ParticipantDetailDTO>) {
        Object.assign(this, init);
    }
}

export class PostDTO {
    @ApiProperty({ description: 'The unique identifier of the post', type: String })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({ description: 'The name of the post', type: String })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'Name cannot be more than 50 characters' })
    postName!: string;

    @ApiProperty({ description: 'The description of the post', type: String })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500, { message: 'Post description cannot be more than 500 characters' })
    postDescription!: string;

   @ApiProperty({ description: 'The images of the post', type: [String] })
    @IsArray()
    @ArrayNotEmpty({ message: 'At least one image is required' })
    @IsString({ each: true })  // Ensures that each item in the array is a string
    postImages!: string[];

    @ApiProperty({ description: 'The images of the post', type: [String] })
    @IsArray()
    @ArrayNotEmpty({ message: 'At least one image is required' })
    @IsString({ each: true })  // Ensures that each item in the array is a string
    postImagesKey!: string[];


    @ApiProperty({ description: 'The images of the post', type: [String] })
    @IsArray()
    @ArrayNotEmpty({ message: 'At least one image is required' })
    @IsString({ each: true })  // Ensures that each item in the array is a string
    postImageDisplay!: ImageDisplayDTO[];

    @ApiProperty({ description: 'The media type of the post', type: String })
    @IsString()
    @IsNotEmpty()
    postMediaType!: string;

    @ApiProperty({ description: 'The roles in the project associated with the post', type: [String] })
    @IsArray()
    @IsString({ each: true }) 
    postProjectRoles!: string[];

    @ApiProperty({ description: 'The roles in the project associated with the post', type: [String] })
    @IsArray()
    @IsString({ each: true }) 
    postProjectRolesOut!: PostProjectRoleDTO[];

    @ApiProperty({ description: 'The roles in the project associated with the post', type: [String] })
    @IsArray()
    @IsObject({ each: true }) 
    participants!: ParticipantDetailInPostDTO[];

    @ApiProperty({ description: 'The status of the post', enum: ['created', 'in-progress', 'success', 'cancel'] })
    @IsString()
    @IsEnum(['created', 'in-progress', 'success', 'cancel'], { message: 'Status must be one of: created, in-progress, success, cancel' })
    postStatus!: 'created' | 'in-progress' | 'success' | 'cancel';

    @ApiProperty({ description: 'The start date of the post' })
    @IsString()  
    startDate!: string;

    @ApiProperty({ description: 'The end date of the post' })
    @IsString()
    endDate!: string;

    @ApiProperty({ description: 'The post detail ID which is a reference to the PostDetail model', type: String })
    @IsString()
    @IsNotEmpty()
    postDetailID!: string;  // This is the reference to the PostDetail model

    @ApiProperty({ description: 'The user ID which is a reference to the User model', type: String })
    @IsString()
    @IsNotEmpty()
    userID!: string;  // This is the reference to the PostDetail model

    constructor(init?: Partial<PostDTO>) {
        Object.assign(this, init);
    }
}


export class PostSearchRequestDTO {
    @ApiProperty({ description: 'The name of the post or project detail', type: String })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'searchText cannot be more than 100 characters' })
    searchText!: string;

    @ApiProperty({ description: 'The media type of the post', type: [String] })
    @IsString()
    @IsNotEmpty()
    postMediaTypes!: string[];

    @ApiProperty({ description: 'The roles in the project associated with the post', type: [String] })
    @IsArray()
    @IsString({ each: true })  // Ensures that each item in the array is a string
    roleRequirements!: string[];

    @ApiProperty({ description: 'The number of post per page' })
    @IsNumber()  
    limit!: number;

    @ApiProperty({ description: 'The current page' })
    @IsNumber() 
    page!: number;
}





export class PostWithRoleCountDTO extends PostDTO{
    @ApiProperty({ description: 'The count of all role in post' })
    @IsNumber()
    roleCount!: number;

    @ApiProperty({ description: 'The detail of role in post'})
    @IsArray()
    @IsString({ each: true })
    postProjectRoles!: string[];

    constructor(data: Partial<PostWithRoleCountDTO>){
        super(data);
        this.postProjectRoles = data.postProjectRoles!;
        this.roleCount = data.roleCount!;
    }
}

export class OfferRequestDTO {
    @ApiProperty({ description: 'The id of user', type: String })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ description: 'The id of post', type: String })
    @IsString()
    postId!: string;

    @ApiProperty({ description: 'The status of post', type: String })
    @IsString()  
    postStatus!: string;

    @ApiProperty({ description: 'The number of post per page' })
    @IsNumber()  
    limit!: number;

    @ApiProperty({ description: 'The current page' })
    @IsNumber() 
    page!: number;
}

export class OfferResponseDTO {
    _id!: string;
    postName!: string;
    roleName!: string; // Role offered to the participant
    currentWage!: number; // The amount offered for the role
    reason!: string;
    offeredBy!: number; // User ID should be better than 0/1 ?
    status!: string;
    createdAt!: Date;
    constructor(
        init : {_id: string,
        postName: string,
        roleName: string,
        currentWage: number,
        reason: string,
        offeredBy: number,
        status: string,
        createdAt: Date}
      ) {
        this._id = init._id;
        this.postName = init.postName;
        this.roleName = init.roleName;
        this.currentWage = init.currentWage;
        this.reason = init.reason;
        this.offeredBy = init.offeredBy;
        this.status = init.status;
        this.createdAt = init.createdAt;
      }
}

export class GetPostByProfDTO {
    @ApiProperty({ description: 'The id of user', type: String })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ description: 'The status of post', type: String })
    @IsString()  
    postStatus!: string;

    @ApiProperty({ description: 'The number of post per page' })
    @IsNumber()  
    limit!: number;

    @ApiProperty({ description: 'The current page' })
    @IsNumber() 
    page!: number;
}