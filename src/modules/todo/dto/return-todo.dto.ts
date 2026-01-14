import { ApiProperty } from '@nestjs/swagger';

export class ReturnTodoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @ApiProperty({ example: 'Milk, Bread, Eggs', required: false })
  description?: string;

  @ApiProperty({ example: false })
  isClosed: boolean;

  @ApiProperty({ example: '2026-01-14T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-14T09:00:00.000Z' })
  updatedAt: Date;
}
