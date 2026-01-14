import { TodoService } from './todo.service';
import { TodoEntity } from '../../entities/todo.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto, UpdateTodoAdminDto, UpdateTodoDto } from '../../dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;

  const mockTodoEntity: TodoEntity = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    isClosed: false,
    createdAt: new Date('2026-01-14T10:00:00.000Z'),
    updatedAt: new Date('2026-01-14T10:00:00.000Z'),
    createdById: 1,
    updatedById: 1,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };
      const userId = 1;
      const corrId = 100;

      mockRepository.create.mockReturnValue(mockTodoEntity);
      mockRepository.save.mockResolvedValue(mockTodoEntity);

      const result = await service.create(corrId, userId, createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        createdById: userId,
        updatedById: userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTodoEntity);
      expect(result).toEqual({
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        isClosed: false,
        createdById: 1,
        updatedById: 1,
        createdAt: '2026-01-14T10:00:00.000Z',
        updatedAt: '2026-01-14T10:00:00.000Z',
      });
    });
  });

  describe('findAll', () => {
    it('should return all todos for admin', async () => {
      const corrId = 100;
      const userId = 1;
      const isAdmin = true;

      mockRepository.find.mockResolvedValue([mockTodoEntity]);

      const result = await service.findAll(corrId, userId, isAdmin);

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return only open todos for non-admin user', async () => {
      const corrId = 100;
      const userId = 2;
      const isAdmin = false;

      const userTodo = { ...mockTodoEntity, createdById: 2 };
      mockRepository.find.mockResolvedValue([userTodo]);

      const result = await service.findAll(corrId, userId, isAdmin);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { createdById: userId, isClosed: false },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a todo for admin', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = true;

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);

      const result = await service.findOne(corrId, id, userId, isAdmin);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if todo not found', async () => {
      const corrId = 100;
      const id = 999;
      const userId = 1;
      const isAdmin = true;

      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOne(corrId, id, userId, isAdmin),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user tries to access others todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 2;
      const isAdmin = false;

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);

      await expect(
        service.findOne(corrId, id, userId, isAdmin),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user tries to access closed todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = false;

      const closedTodo = { ...mockTodoEntity, isClosed: true };
      mockRepository.findOneBy.mockResolvedValue(closedTodo);

      await expect(
        service.findOne(corrId, id, userId, isAdmin),
      ).rejects.toThrow(ForbiddenException);
    });

    // ✅ NEU:  Teste BEIDE Bedingungen gleichzeitig (Zeile 98!)
    it('should throw ForbiddenException if user tries to access closed todo from another user', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 2;
      const isAdmin = false;

      const closedTodo = { ...mockTodoEntity, createdById: 1, isClosed: true };
      mockRepository.findOneBy.mockResolvedValue(closedTodo);

      await expect(
        service.findOne(corrId, id, userId, isAdmin),
      ).rejects.toThrow(ForbiddenException);
    });

    // ✅ NEU: User kann eigenes offenes Todo sehen
    it('should allow user to access their own open todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = false;

      const openTodo = { ...mockTodoEntity, createdById: 1, isClosed: false };
      mockRepository.findOneBy.mockResolvedValue(openTodo);

      const result = await service.findOne(corrId, id, userId, isAdmin);

      expect(result.id).toBe(1);
      expect(result.isClosed).toBe(false);
    });
  });

  describe('update', () => {
    it('should update todo for admin', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = true;
      const updateDto: UpdateTodoAdminDto = { isClosed: true };

      const updatedTodo = { ...mockTodoEntity, isClosed: true, updatedById: 1 };

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);
      mockRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(
        corrId,
        id,
        userId,
        isAdmin,
        updateDto,
      );

      expect(result.isClosed).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    // ✅ NEU: Admin setzt isClosed auf false
    it('should allow admin to reopen todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = true;
      const updateDto: UpdateTodoAdminDto = { isClosed: false };

      const closedTodo = { ...mockTodoEntity, isClosed: true };
      const reopenedTodo = {
        ...mockTodoEntity,
        isClosed: false,
        updatedById: 1,
      };

      mockRepository.findOneBy.mockResolvedValue(closedTodo);
      mockRepository.save.mockResolvedValue(reopenedTodo);

      const result = await service.update(
        corrId,
        id,
        userId,
        isAdmin,
        updateDto,
      );

      expect(result.isClosed).toBe(false);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should allow user to close their own todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 2;
      const isAdmin = false;
      const updateDto: UpdateTodoDto = { isClosed: true };

      const userTodo = {
        ...mockTodoEntity,
        createdById: userId,
        isClosed: false,
      };

      const updatedTodo = { ...userTodo, isClosed: true, updatedById: userId };

      mockRepository.findOneBy.mockResolvedValue(userTodo);
      mockRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(
        corrId,
        id,
        userId,
        isAdmin,
        updateDto,
      );

      expect(result.isClosed).toBe(true);
    });

    it('should throw NotFoundException if todo not found', async () => {
      const corrId = 100;
      const id = 999;
      const userId = 1;
      const isAdmin = true;
      const updateDto: UpdateTodoAdminDto = { isClosed: true };

      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(corrId, id, userId, isAdmin, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user tries to update others todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 2;
      const isAdmin = false;
      const updateDto: UpdateTodoDto = { isClosed: true };

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);

      await expect(
        service.update(corrId, id, userId, isAdmin, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user tries to reopen todo', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = false;
      const updateDto: UpdateTodoDto = { isClosed: false };

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);

      await expect(
        service.update(corrId, id, userId, isAdmin, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete todo for admin', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 1;
      const isAdmin = true;

      mockRepository.findOneBy.mockResolvedValue(mockTodoEntity);
      mockRepository.remove.mockResolvedValue(mockTodoEntity);

      const result = await service.remove(corrId, id, isAdmin, userId);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockTodoEntity);
      expect(result.id).toBe(1);
    });

    it('should throw ForbiddenException if non-admin tries to delete', async () => {
      const corrId = 100;
      const id = 1;
      const userId = 2;
      const isAdmin = false;

      await expect(service.remove(corrId, id, isAdmin, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if todo not found', async () => {
      const corrId = 100;
      const id = 999;
      const userId = 2;
      const isAdmin = true;

      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(corrId, id, isAdmin, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
