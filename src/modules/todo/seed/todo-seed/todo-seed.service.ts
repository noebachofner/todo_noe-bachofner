import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TodoEntity } from '../../entities/todo.entity';

@Injectable()
export class TodoSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TodoSeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const todoRepo = this.dataSource.getRepository(TodoEntity);
    this.logger.debug(`${this.seed.name}:  start`);

    const count = await todoRepo.count();
    if (count > 0) {
      this.logger.debug(
        `${this.seed.name}: Todos already exist, skipping seed`,
      );
      return;
    }

    const demoTodos = [
      {
        id: 1,
        userId: 1,
        title: 'Open admin',
        description: 'Example of an open admin todo',
        isClosed: false,
      },
      {
        id: 2,
        userId: 1,
        title: 'Closed admin',
        description: 'Example of a closed admin todo',
        isClosed: true,
      },
      {
        id: 3,
        userId: 2,
        title: 'Open user',
        description: 'Example of an open user todo',
        isClosed: false,
      },
      {
        id: 4,
        userId: 2,
        title: 'Closed user',
        description: 'Example of a closed user todo',
        isClosed: true,
      },
    ];

    for (const todo of demoTodos) {
      this.logger.verbose(
        `${this.seed.name}: Creating todo id=${todo.id}, userId=${todo.userId}, title=${todo.title}`,
      );
      await todoRepo.save(todoRepo.create(todo));
    }

    this.logger.debug(`${this.seed.name}: ${demoTodos.length} todos created`);
  }
}
