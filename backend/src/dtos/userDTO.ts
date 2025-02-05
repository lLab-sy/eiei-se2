import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, IsEnum, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BankAccountDto } from './bankAccountDTO';

export class UserDTO {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  @MinLength(15)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Role of the user', enum: ["producer", "production professional", "admin"] })
  @IsEnum(["producer", "production professional", "admin"])
  role!: "producer" | "production professional" | "admin";

  @ApiProperty({ description: 'First name of the user', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Middle name of the user', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: 'Gender of the user', enum: ["Male", "Female", "Non-Binary", "Other"], required: false })
  @IsOptional()
  @IsEnum(["Male", "Female", "Non-Binary", "Other"])
  gender?: "Male" | "Female" | "Non-Binary" | "Other";

  @ApiProperty({ description: 'Bank account details', required: false, type: BankAccountDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount?: BankAccountDto;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;
}

export interface searchReqDTO {
  searchText?: string;
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  limit: number;
  page: number;
}