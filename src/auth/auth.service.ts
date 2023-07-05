import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAdmin } from './utils/types/registerAdmin';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Otp } from 'src/typeorm/entities/Otp';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const passwordValid = await bcrypt.compare(pass, user.password);
    if (user && passwordValid) {
      const { password, ...result } = user;
      return result;
    }
    return false;
  }

  async signIn(phoneNumber: string, pass: string) {
    let passwordValid: boolean;
    const user = await this.usersService.findOne(phoneNumber);
    if (user) {
      passwordValid = await bcrypt.compare(pass, user.password);
    }
    if (!user || !passwordValid) {
      throw new HttpException(
        'رمز عبور یا نام کاربری اشتباه است',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
  }

  async registerAdmin(registerAdminDetail: RegisterAdmin) {
    const checkUserBuynationalCode = await this.usersService.findOneByObject({
      nationalCode: registerAdminDetail.nationalCode,
    });

    if (checkUserBuynationalCode) {
      throw new HttpException(
        `کاربر با کدملی ${registerAdminDetail.nationalCode} در سامانه ثبت نام شده است`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const checkUserBuyPhounNumber = await this.usersService.findOneByObject({
      phoneNumber: registerAdminDetail.phoneNumber,
    });

    if (checkUserBuyPhounNumber) {
      throw new HttpException(
        `کاربر با شماره تماس  ${registerAdminDetail.phoneNumber } در سامانه ثبت نام شده است`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerAdminDetail.password,
      saltOrRounds,
    );

    const newUser = this.userRepository.create({
      ...registerAdminDetail,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async createOtp(
    phoneNumber: string,
    otp: number,
    expiration: Date,
  ): Promise<Otp | undefined> {
    const otpCode = this.otpRepository.create({
      phoneNumber,
      otp,
      expiration,
    });
    return this.otpRepository.save(otpCode);
  }

  findOtp(otp: number): Promise<Otp | undefined> {
    return this.otpRepository.findOneBy({ otp });
  }

  async signInPublic(user: User) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
    };
  }
}
