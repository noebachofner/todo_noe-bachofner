import { CorrId } from '../../../../decorators/corr-id.decorator';
import { AuthGuard } from '../../../auth/user/guards/auth.guard';
import { IsAdmin, UserId } from '../../../auth/user/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from '../../services/todo/todo.service';
import {
  CreateTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
  UpdateTodoDto,
} from '../../dto';

@ApiTags('todo')
@Controller('todo')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized, user must be signed in',
})
export class TodoController {
  private readonly logger = new Logger(TodoController.name);

  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new todo',
    description: 'Create a new todo item for the authenticated user',
  })
  @ApiCreatedResponse({
    description: 'Todo successfully created',
    type: ReturnTodoDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, validation failed',
  })
  @ApiBody({ type: CreateTodoDto })
  create(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    this.logger.log(
      `${corrId} ${this.create.name} userId: ${userId}, createTodoDto: ${JSON.stringify(createTodoDto, null, 2)}`,
    );
    return this.todoService.create(corrId, userId, createTodoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all todos',
    description:
      'Users get their own open todos.  Admins get all todos regardless of status.',
  })
  @ApiOkResponse({
    description: 'List of todos',
    type: ReturnTodoDto,
    isArray: true,
  })
  findAll(
    @CorrId() corrId: number,
    @UserId() userId: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    this.logger.log(
      `${corrId} ${this.findAll.name} userId: ${userId}, isAdmin:  ${isAdmin}`,
    );
    return this.todoService.findAll(corrId, userId, isAdmin);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a todo by id',
    description:
      'Users can only access their own open todos. Admins can access all todos.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Todo found',
    type: ReturnTodoDto,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  @ApiForbiddenResponse({
    description: 'Access denied',
  })
  findOne(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    this.logger.log(
      `${corrId} ${this.findOne.name} id: ${id}, userId: ${userId}, isAdmin: ${isAdmin}`,
    );
    return this.todoService.findOne(corrId, id, userId, isAdmin);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a todo',
    description:
      'Users can only close their own todos (set isClosed to true). Admins can update all fields of any todo.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Todo updated',
    type: ReturnTodoDto,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  @ApiForbiddenResponse({
    description: 'Access denied',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, validation failed',
  })
  @ApiBody({
    description:
      'For users: UpdateTodoDto (only isClosed). For admins: UpdateTodoAdminDto (all fields)',
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/UpdateTodoDto' },
        { $ref: '#/components/schemas/UpdateTodoAdminDto' },
      ],
    },
  })
  update(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @IsAdmin() isAdmin: boolean,
    @Body() updateDto: UpdateTodoDto | UpdateTodoAdminDto,
  ) {
    this.logger.log(
      `${corrId} ${this.update.name} id: ${id}, userId: ${userId}, isAdmin: ${isAdmin}, updateDto: ${JSON.stringify(updateDto, null, 2)}`,
    );
    return this.todoService.update(corrId, id, userId, isAdmin, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a todo',
    description: 'Only admins can delete todos.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Todo deleted',
    type: ReturnTodoDto,
  })
  @ApiNotFoundResponse({
    description: 'Todo not found',
  })
  @ApiForbiddenResponse({
    description: 'Only admins can delete todos',
  })
  remove(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    this.logger.log(
      `${corrId} ${this.remove.name} id: ${id}, isAdmin: ${isAdmin}`,
    );
    return this.todoService.remove(corrId, id, isAdmin);
  }
}
