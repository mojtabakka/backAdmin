import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UsersController } from './users.controller';
import { Role } from 'src/typeorm/entities/Role';
import { UserPublic } from 'src/typeorm/entities/UserPublic';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserPublic])],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
