// import { IsString, IsNotEmpty, MaxLength, IsEnum, IsDate } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class PostDTO {
//     // @ApiProperty({
//     //   description: 'The unique identifier of the post',
//     //   type: String,
//     // })
//     // @IsString()
//     // @IsNotEmpty()
//     // id!: String;

//     // @ApiProperty({
//     //   description: 'The name of the post',
//     //   type: String,
//     // })
//     // @IsString()
//     // @IsNotEmpty()
//     // @MaxLength(50, { message: 'Name cannot be more than 50 characters' })
//     // postName!: String;

//     // @ApiProperty({
//     //     description: 'The description of the post',
//     //     type: String,
//     //   })
//     //   @IsString()
//     //   @IsNotEmpty()
//     //   @MaxLength(500, { message: 'postDescription cannot be more than 50 characters' })
//     //   postDescription!: String;

//     //   @ApiProperty({
//     //     description: 'The image of the post',
//     //     type: String,
//     //   })
//     //   @IsString()
//     //   @IsNotEmpty()
//     //   postImage!: String;

//     //   @ApiProperty({
//     //     description: 'The mediaType of the post',
//     //     type: String,
//     //   })
//     //   @IsString()
//     //   @IsNotEmpty()
//     //   postMediaType!: String;

//     //   @ApiProperty({
//     //     description: 'The role in the project associated with the post',
//     //     enum: ['actor', 'cameraman', 'editor', 'vtuber'],
//     //   })
//     //   @IsString()
//     //   @IsEnum(['actor', 'cameraman', 'editor', 'vtuber'], {
//     //     message: 'Post project role must be one of the following: actor, cameraman, editor, vtuber',
//     //   })
//     //   postProjectRole!: String;

//     //   @ApiProperty({
//     //     description: 'The status of the post',
//     //     enum: ['created', 'in-progress', 'success', 'delete'],
//     //   })
//     //   @IsString()
//     //   @IsEnum(['created', 'in-progress', 'success', 'delete'], {
//     //     message: 'Post status must be one of the following: created, in-progress, success, delete',
//     //   })
//     //   postStatus!: String;

//     //   //start date
//     //   @ApiProperty()
//     //   @IsDate()
//     //   startDate!: String;
    
//     //   @ApiProperty()
//     //   @IsDate()
//     //   endDate!: String;
//   //   constructor(
//   //     private postName: string,
//   //     private postDescription: string,
//   //     private postImages: string,
//   //     private postMediaType: string,
//   //     private postProjectRole:'actor'| 'cameraman'| 'editor'|'vtuber',
//   //     private postStatus:'created'| 'in-progress'| 'success'|'delete',
//   //     private startDate:string,
//   //     private endDate:string
//   // ) {}
 
//     @ApiProperty({ description: 'The unique identifier of the post', type: String })
//     @IsString()
//     @IsNotEmpty()
//     id!: string;

//     @ApiProperty({ description: 'The name of the post', type: String })
//     @IsString()
//     @IsNotEmpty()
//     @MaxLength(50, { message: 'Name cannot be more than 50 characters' })
//     postName!: string;

//     @ApiProperty({ description: 'The description of the post', type: String })
//     @IsString()
//     @IsNotEmpty()
//     @MaxLength(500, { message: 'postDescription cannot be more than 500 characters' })
//     postDescription!: string;

//     @ApiProperty({ description: 'The image of the post', type: String })
//     @IsString()
//     @IsNotEmpty()
//     postImage!: string;

//     @ApiProperty({ description: 'The media type of the post', type: String })
//     @IsString()
//     @IsNotEmpty()
//     postMediaType!: string;

//     @ApiProperty({ description: 'The role in the project associated with the post', enum: ['actor', 'cameraman', 'editor', 'vtuber'] })
//     @IsString()
//     @IsEnum(['actor', 'cameraman', 'editor', 'vtuber'], { message: 'Role must be one of: actor, cameraman, editor, vtuber' })
//     postProjectRole!: 'actor' | 'cameraman' | 'editor' | 'vtuber';

//     @ApiProperty({ description: 'The status of the post', enum: ['created', 'in-progress', 'success', 'delete'] })
//     @IsString()
//     @IsEnum(['created', 'in-progress', 'success', 'delete'], { message: 'Status must be one of: created, in-progress, success, delete' })
//     postStatus!: 'created' | 'in-progress' | 'success' | 'delete';

//     @ApiProperty({ description: 'The start date of the post' })
//     // @IsDate()
//     startDate!: Date;

//     @ApiProperty({ description: 'The end date of the post' })
//     // @IsDate()
//     endDate!: Date;

//     constructor(init?: Partial<PostDTO>) {
//         Object.assign(this, init);
    
//   }
// }


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
    @IsDate()  
    startDate!: Date;

    @ApiProperty({ description: 'The end date of the post' })
    @IsDate() // Use @IsDate() to validate Date fields
    endDate!: Date;

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