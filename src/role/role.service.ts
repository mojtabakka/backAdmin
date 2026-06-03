// src/role/role.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/typeorm/entities/Role';
import { User } from 'src/typeorm/entities/User';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  // constructor(
  //   @InjectRepository(Role)
  //   private readonly roleRepository: Repository<Role>,
  // ) { }

  // async create(createRoleDto: CreateRoleDto) {


  //   const role = this.roleRepository.create({
  //     role: createRoleDto.role,
  //   });

  //   return this.roleRepository.save(role);
  // }

  // async findAll() {
  //   return this.roleRepository.find({
  //     relations: {
  //       user: true,
  //     },
  //   });
  // }

  // async findOne(id: number) {
  //   const role = await this.roleRepository.findOne({
  //     where: { id },
  //     relations: {
  //       user: true,
  //     },
  //   });

  //   if (!role) {
  //     throw new NotFoundException('نقش پیدا نشد');
  //   }

  //   return role;
  // }

  // async remove(id: number) {
  //   const role = await this.findOne(id);

  //   await this.roleRepository.remove(role);

  //   return {
  //     message: 'نقش حذف شد',
  //   };
  // }
}