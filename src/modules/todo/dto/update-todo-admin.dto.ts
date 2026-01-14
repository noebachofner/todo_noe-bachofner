import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTodoAdminDto {
  @ApiProperty({
    example: false,
    description: 'Todo status (admins can set true or false)',
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed: boolean;
}
