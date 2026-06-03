// src/seed/admin-seeder.service.ts

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/role/entities/role.entity';
import { Role as RoleObj } from 'src/constants'
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async onApplicationBootstrap() {
        const roles = [RoleObj.User, RoleObj.Admin]
        for (const roleName of roles) {
            const roleExists = await this.roleRepository.findOne({
                where: {
                    role: roleName,
                },
            });

            if (!roleExists) {
                await this.roleRepository.save({
                    role: roleName,
                });

                console.log(`✅ Role ${roleName} created`);
            }
        }

        const admin = await this.usersService.findOneByObject({
            phoneNumber: '09107195182',
        });

        if (admin) {
            console.log('✅ Admin already exists');
            return;
        }

        const result = await this.authService.registerAdmin({
            username: process.env.DEFAULT_ADMIN_USERNAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            lastName: process.env.DEFAULT_ADMIN_LAST_NAME!,
            phoneNumber: process.env.DEFAULT_ADMIN_PHONE!,
            nationalCode: process.env.DEFAULT_ADMIN_NATIONAL_CODE!,
            password: process.env.DEFAULT_ADMIN_PASSWORD!,
        });

        this.usersService.setUserRole(result.id, RoleObj.Admin);
    }
}
