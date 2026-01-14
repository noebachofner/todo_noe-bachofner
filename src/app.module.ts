import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'data/todo.db',
      entities: [__dirname + '/**/*. entity{.ts,.js}'],
      synchronize: true, // Only Development
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
