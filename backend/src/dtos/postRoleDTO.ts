import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostRoleDTO {
    @ApiProperty({
      description: 'Unique identifier for the role',
      type: String,
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()  
    @IsNotEmpty()
    id!: string;

    @ApiProperty({
      description: 'The name of the post role (can be any string)',
      type: String,
      example: 'director' 
    })
    @IsString()
    @IsNotEmpty()
    roleName!: string;
}
