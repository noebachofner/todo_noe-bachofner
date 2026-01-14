import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { UserModule } from '../auth/user/user.module';
import { TodoController } from './controller/todo/todo.controller';
import { TodoService } from './services/todo/todo.service';
import { TodoSeedService } from './seed/todo-seed/todo-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), UserModule],
  controllers: [TodoController],
  providers: [TodoService, TodoSeedService],
  exports: [TodoService],
})
export class TodoModule {}
