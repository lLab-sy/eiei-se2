import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class BankAccountDto {
  @ApiProperty({ description: 'Name of the bank', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Name of the account holder', required: false })
  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @ApiProperty({ description: 'Bank account number', required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;
}