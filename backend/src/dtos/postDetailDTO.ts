import { IsString, IsNotEmpty, IsArray, IsObject, IsOptional, IsUUID } from 'class-validator';
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

    // @ApiProperty({
    //     description: 'Offer details (next sprint)',
    //     type: [Object],
    //     example: [
    //         { RoleID: '123e4567-e89b-12d3-a456-426614174001', OfferID: 'offer1' },
    //         { RoleID: '123e4567-e89b-12d3-a456-426614174002', OfferID: 'offer2' }
    //     ],
    //     required: false
    // })
    // @IsArray()
    // @IsOptional()
    // @IsObject({ each: true })
    // OfferDetail?: Array<{ RoleID: string; OfferID: string }>;
    constructor(init?: Partial<PostDetailDTO>) {
        Object.assign(this, init);
    }
}

