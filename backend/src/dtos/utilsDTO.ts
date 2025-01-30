import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDTO {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page!: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit!: number;

  @ApiProperty({ example: 50, description: 'Total number of items available' })
  totalItems!: number;

  @ApiProperty({ example: 5, description: 'Total number of pages available' })
  totalPages!: number;
}

export class PaginatedResponseDTO<T> {
  @ApiProperty({ description: 'Array of items for the current page', isArray: true })
  data!: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta!: PaginationMetaDTO;
}
