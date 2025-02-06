import { IsString, IsNotEmpty, IsArray, IsObject, IsOptional, IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostDetailDTO {
    @ApiProperty({
        description: 'Unique identifier for the post detail',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({
        description: 'The unique identifier of the post associated with the post detail',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postId!: string;

    @ApiProperty({
        description: 'The candidate details for the post, including RoleID and CandidateID',
        type: [Object],
        example: [
            { RoleID: '123e4567-e89b-12d3-a456-426614174001', CandidateID: 'candidate1' },
            { RoleID: '123e4567-e89b-12d3-a456-426614174002', CandidateID: 'candidate2' }
        ],
    })
    @IsArray()
    @IsNotEmpty()
    @IsObject({ each: true })
    CandidateDetail!: Array<{ RoleID: string; CandidateID: string }>;

  
    constructor(init?: Partial<PostDetailDTO>) {
        Object.assign(this, init);
    }
}

export class ProductionProfessionalHistoryDTO {
    @ApiProperty({
        description: 'Unique identifier for the postID',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postID!: string;

    @ApiProperty({
        description: 'Unique identifier for the postDetailID',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postDetailID!: string;

    @ApiProperty({
        description: 'Unique identifier for the userID',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    userID!: string;

    @ApiProperty({
        description: 'The role of user in this post',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    roleName!: string;


    @ApiProperty({
        description: 'The postStatus of this post need to be success',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postStatus!: string;

    @ApiProperty({
        description: 'The post description of this post',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postDescription!: string;

    @ApiProperty({
        description: 'The List of post images',
        type: [String],
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    postImages!: string[];

    @ApiProperty({
        description: 'Start Date of work',
        type: Date,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    
    @IsDate()  
    startDate!: Date;

    @ApiProperty({
        description: 'End Date of work',
        type: Date,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })

    @IsDate()  
    endDate!: Date;
     
    constructor(init?: Partial<ProductionProfessionalHistoryDTO >) {
        Object.assign(this, init);
    }
}

