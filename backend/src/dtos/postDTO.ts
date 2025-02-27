import { IsString, IsNotEmpty, MaxLength, IsEnum, IsDate, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

    @ApiProperty({ description: 'The media type of the post', type: String })
    @IsString()
    @IsNotEmpty()
    postMediaType!: string;

    @ApiProperty({ description: 'The roles in the project associated with the post', type: [String] })
    @IsArray()
    @IsString({ each: true }) 
    postProjectRoles!: string[];

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