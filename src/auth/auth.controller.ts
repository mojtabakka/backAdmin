import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SigninDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { RegisterAdminDto } from './dtos/registerAdmin.dto';
import { Response } from 'express';
import * as speakeasy from 'speakeasy';
import { generate } from 'otp-generator';
import { AddMinutesToDate } from 'src/common/utils/functions.utils';
import { UsersService } from 'src/users/users.service';
import { CreateUserPublicDto } from './dtos/createUserPublic.dto';
import { SendOtpDto } from './dtos/sendotp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('admin/login')
  @Public()
  async login(@Body() signInDto: SigninDto, @Res() res: Response) {
    console.log('loggggigngngn');
    
    const data = await this.authService.signIn(
      signInDto.phoneNumber,
      signInDto.password,
    );
    res.cookie('token', data.token, {
      httpOnly: true,
      path: '/',
    });

    res.status(HttpStatus.OK).json({
      message: 'login Successfull',
      data,
    });
  }

  @Public()
  @Post('admin/register')
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authService.registerAdmin(registerAdminDto);
  }

  @Get('profile')
  @Roles(Role.Admin)
  @Public()
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('secret')
  @Public()
  async getSecret() {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret;
  }

  @Post('send-otp')
  @Public()
  async sendOtp(@Body() phoneNumber: SendOtpDto, @Res() res: Response) {
    const otpCode = generate(4, {
      digits: true,
      alphabets: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 1);
    const data = await this.authService.createOtp(
      phoneNumber.phoneNumber,
      otpCode,
      expiration_time,
    );
    console.log(otpCode);
    
    res.status(HttpStatus.OK).json({
      message: `otp sent to your phone`,
      data: {
        sent: true,
      },
    });
  }

  @Post('verification')
  @Public()
  async verification(
    @Body() createUserPublicDto: CreateUserPublicDto,
    @Body() OtpCode,
    @Res() res: Response,
    @Res({ passthrough: true }) response: Response,
  ) {
    let user;
    const otp = await this.authService.findOtp(OtpCode.otp);

    if (otp === null) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'رمز یک بار مصرف اشتباه وارد شده است',
      });
      return;
    }
    const now = new Date().getTime() / 60000;
    const optExpiration = otp.expiration;
    const expiration_time = optExpiration.getTime() / 60000;
    const subTimes = expiration_time - now;
    if (subTimes < 0) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'The opt has expired',
        data: null,
      });
      return;
    }

    user = await this.userService.getPublicUser(
      createUserPublicDto.phoneNumber,
    );
    if (!user) {
      user = await this.userService.createUserPublic(createUserPublicDto);
    }
    const token = await this.authService.signInPublic(user);
    response.cookie('token', token.token, {
      httpOnly: true,
      path: '/',
    });
    res.status(HttpStatus.OK).json({
      message: 'verified successfully',
      data: {
        token,
      },
    });
  }
}
