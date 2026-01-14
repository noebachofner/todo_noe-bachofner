import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    example: true,
    description: 'Set todo as closed (users can only set to true)',
  })
  @IsBoolean()
  @IsNotEmpty()
  isClosed: boolean;
}
