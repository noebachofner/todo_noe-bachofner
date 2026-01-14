import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../../entities/todo.entity';
import {
  CreateTodoDto,
  ReturnTodoDto,
  UpdateTodoAdminDto,
  UpdateTodoDto,
} from '../../dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(TodoEntity)
    private readonly repo: Repository<TodoEntity>,
  ) {}

  private entityToDto(corrId: number, entity: TodoEntity): ReturnTodoDto {
    this.logger.verbose(
      `${corrId} ${this.entityToDto.name} entity:  ${JSON.stringify(entity, null, 2)}`,
    );
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      isClosed: entity.isClosed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async create(
    corrId: number,
    userId: number,
    createDto: CreateTodoDto,
  ): Promise<ReturnTodoDto> {
    this.logger.debug(
      `${corrId} ${this.create.name} userId: ${userId}, createDto: ${JSON.stringify(createDto, null, 2)}`,
    );
    const entity = this.repo.create({
      ...createDto,
      userId,
    });
    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  async findAll(
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoDto[]> {
    this.logger.verbose(
      `${corrId} ${this.findAll.name} userId: ${userId}, isAdmin:  ${isAdmin}`,
    );

    let todos: TodoEntity[];

    if (isAdmin) {
      // Admin:  alle Todos zurückgeben
      todos = await this.repo.find();
    } else {
      // User: nur eigene Todos mit isClosed=false
      todos = await this.repo.find({
        where: { userId, isClosed: false },
      });
    }

    return todos.map((e) => this.entityToDto(corrId, e));
  }

  async findOne(
    corrId: number,
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoDto> {
    this.logger.verbose(
      `${corrId} ${this.findOne.name} id: ${id}, userId:  ${userId}, isAdmin: ${isAdmin}`,
    );

    const entity = await this.repo.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    // User:  nur eigene Todos mit isClosed=false
    if (!isAdmin) {
      if (entity.userId !== userId || entity.isClosed) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.entityToDto(corrId, entity);
  }

  async update(
    corrId: number,
    id: number,
    userId: number,
    isAdmin: boolean,
    updateDto: UpdateTodoDto | UpdateTodoAdminDto,
  ): Promise<ReturnTodoDto> {
    this.logger.verbose(
      `${corrId} ${this.update.name} id: ${id}, userId: ${userId}, isAdmin: ${isAdmin}`,
    );

    const entity = await this.repo.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    // User: nur eigene Todos ändern, nur isClosed auf true setzen
    if (!isAdmin) {
      if (entity.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      const userUpdate = updateDto as UpdateTodoDto;
      if (userUpdate.isClosed !== true) {
        throw new ForbiddenException('Users can only set isClosed to true');
      }

      entity.isClosed = true;
    } else {
      // Admin: alles ändern
      Object.assign(entity, updateDto);
    }

    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  async remove(
    corrId: number,
    id: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoDto> {
    this.logger.verbose(
      `${corrId} ${this.remove.name} id: ${id}, isAdmin: ${isAdmin}`,
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can delete todos');
    }

    const entity = await this.repo.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    await this.repo.remove(entity);
    return this.entityToDto(corrId, entity);
  }
}
