import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDTO } from './userDTO';
import { ObjectId } from 'mongoose';

export class RatingDTO {
  @ApiProperty({ description: 'postID (ObjectID)', required: true })
  // @IsObject()
  postID?: ObjectId

  @ApiProperty({ description: 'Rating score (0-5)', required: false, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingScore?: number;

  @ApiProperty({ description: 'Comment for the rating', required: false })
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Created at', required: false })
  @IsString()
  createdAt?: Date;
}

export class ProductionProfessionalDtO extends UserDTO {
  @ApiProperty({ description: 'Occupation of the professional', required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ description: 'Skills of the professional', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skill?: string[];

  @ApiProperty({ description: 'Years of experience', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @ApiProperty({ description: 'Ratings received', required: false, type: [RatingDTO] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RatingDTO)
  rating?: RatingDTO[];
}