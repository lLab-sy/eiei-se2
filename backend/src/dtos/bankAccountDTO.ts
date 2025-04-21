import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

export class BankAccountDto {
  @ApiProperty({ description: 'Recipient ID from payment provider (e.g., Omise)', example: 'recp_test_1234567890' })
  @IsString()
  recipientId!: string;

  @ApiProperty({ description: 'Last 4 digits of the bank account number', example: '1234' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'bankLastDigits must be exactly 4 digits' })
  bankLastDigits!: string;

  @ApiProperty({ description: 'Brand or name of the bank', example: 'KBank' })
  @IsString()
  brand!: string;

  @ApiProperty({ description: 'Name of the account holder', required: false, example: 'Somsak Jaidee' })
  @IsOptional()
  @IsString()
  name?: string;
}
