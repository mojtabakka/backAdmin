import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Otp } from 'src/typeorm/entities/Otp';
import { UserPublic } from 'src/typeorm/entities/UserPublic';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from 'src/common/constants/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp, UserPublic]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
