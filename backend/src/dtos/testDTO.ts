import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestDTO {
    @ApiProperty({
      description: 'The unique identifier of the test',
      type: String,
    })
    @IsString()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({
      description: 'The name of the test',
      type: String,
    })
    @IsString()
    @IsNotEmpty()
    name!: string;
}
