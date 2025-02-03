import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsCreditCard, IsNotEmpty, IsBoolean } from 'class-validator';
import { UserDTO } from './userDTO';

export class ProducerDto extends UserDTO {
  @ApiProperty({ description: 'Company name of the producer', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ description: 'Payment method', enum: ['qrCode', 'creditDebit'], required: false })
  @IsOptional()
  @IsEnum(["qrCode", "creditDebit"])
  paymentType?: "qrCode" | "creditDebit";

  @ApiProperty({ description: 'Name on the credit/debit card', required: false })
  @IsOptional()
  @IsString()
  nameOnCard?: string;

  @ApiProperty({ description: 'Card number for credit/debit payments', required: false })
  @IsOptional()
  @IsString()
  cardNumber?: string;
}