import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTodoAdminDto {
  @ApiProperty({
    example: 'Updated title',
    description: 'Todo title (8-50 characters)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(8, 50)
  title?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Todo description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Todo status (admins can set true or false)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;
}
