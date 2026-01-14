import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../../entities/todo.entity';
import { Repository } from 'typeorm';
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
      `${corrId} ${this.entityToDto.name} entity: ${JSON.stringify(entity, null, 2)}`,
    );
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isClosed: entity.isClosed,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
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
      createdById: userId,
      updatedById: userId,
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
      `${corrId} ${this.findAll.name} userId: ${userId}, isAdmin: ${isAdmin}`,
    );

    let todos: TodoEntity[];

    if (isAdmin) {
      todos = await this.repo.find();
    } else {
      todos = await this.repo.find({
        where: { createdById: userId, isClosed: false },
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
      `${corrId} ${this.findOne.name} id: ${id}, userId: ${userId}, isAdmin:  ${isAdmin}`,
    );

    const entity = await this.repo.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    if (!isAdmin) {
      if (entity.createdById !== userId || entity.isClosed) {
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

    if (!isAdmin) {
      if (entity.createdById !== userId) {
        throw new ForbiddenException('Access denied');
      }

      const userUpdate = updateDto as UpdateTodoDto;
      if (userUpdate.isClosed !== true) {
        throw new ForbiddenException('Users can only set isClosed to true');
      }

      entity.isClosed = true;
    } else {
      const adminUpdate = updateDto as UpdateTodoAdminDto;
      entity.isClosed = adminUpdate.isClosed;
    }

    entity.updatedById = userId;
    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  async remove(
    corrId: number,
    id: number,
    isAdmin: boolean,
    userId: number,
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
    entity.updatedById = userId;
    return this.entityToDto(corrId, entity);
  }
}
