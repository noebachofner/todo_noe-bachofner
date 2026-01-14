import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_DATABASE') || 'data/todo.db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only Development
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
