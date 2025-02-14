import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaTypeDTO {
    @ApiProperty({
      description: 'Unique identifier for the role',
      type: String,
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()  
    @IsNotEmpty()
    id!: string;

    @ApiProperty({
      description: 'The name of mediatype',
      type: String,
      example: 'director' 
    })
    @IsString()
    @IsNotEmpty()
    mediaName!: string;
}
