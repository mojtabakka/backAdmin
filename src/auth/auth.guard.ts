import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from 'src/decorators/roldes.decorator';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from 'src/common/constants/config';
import { Role } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const checkUser = roles.find((item) => item === Role.User);
    const checkAdmin = roles.find((item) => item === Role.Admin);
    if (checkAdmin && checkUser) {
      throw new HttpException('roles is incorrect', HttpStatus.FORBIDDEN);
    }

    if (!roles || !roles[0])
      throw new HttpException(
        'you can not access to this api',
        HttpStatus.FORBIDDEN,
      );

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    if (checkUser) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });

        const user = await this.userService.findOnePublic(payload.phoneNumber);

        // const userRolses = this.getUserRoles(userRolsesObj);

        // if (!this.checkRoles(userRolses, roles)) {
        //   throw new HttpException(
        //     'you can not access to this api',
        //     HttpStatus.FORBIDDEN,
        //   );
        // }
        if (!user) {
          throw new HttpException(
            'you can not access to this api',
            HttpStatus.FORBIDDEN,
          );
        }
        request['user'] = payload;
      } catch (error) {
        console.log('error', error);
      }
    } else {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        const userRolsesObj = (await this.userService.findOne(payload.username))
          .roles;

        const userRolses = this.getUserRoles(userRolsesObj);

        if (!this.checkRoles(userRolses, roles)) {
          throw new HttpException(
            'you can not access to this api',
            HttpStatus.FORBIDDEN,
          );
        }

        request['user'] = payload;
      } catch (error) {
        throw error;
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private getUserRoles(userRolses) {
    return userRolses.map((role) => role.role);
  }

  private checkRoles(roles, userRolses) {
    let isExist = false;
    roles &&
      roles.forEach((element) => {
        if (userRolses[0] && userRolses.find((role) => role === element)) {
          isExist = true;
        }
      });

    return isExist;
  }
}
