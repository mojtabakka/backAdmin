import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from 'src/typeorm/entities/User';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/enums/enums.enum';
import { Response } from 'express';
import { editPublicUser } from './dtos/editPublicUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Public()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User | undefined> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async getUser(@Res() res: Response, @Req() req) {
    const data = await this.userService.findOne(req.user.username);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Get('public-user/user')
  @Roles(Role.User)
  async getUserPublick(@Res() res: Response, @Req() req) {
    const data = await this.userService.getPublicUser(req.user.phoneNumber);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Patch('public-user/user')
  @Roles(Role.User)
  async editPublicUser(
    @Body() editPublicUserDto: editPublicUser,
    @Res() res: Response,
    @Req() req,
  ) {
    // const data = await this.userService.editPublicUser(
    //   editPublicUserDto,
    //   req.user.phoneNumber,
    // );
    // res.status(HttpStatus.OK).json({
    //   data,
    // });
  }

  @Patch()
  @Roles(Role.Admin)
  async EditUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    const data = await this.userService.editUser(createUserDto, req.user);
    res.status(HttpStatus.OK).json({
      message: 'Updated successfully',
      data,
    });
  }

  @Put('addRole/:id')
  @Public()
  setUserRole(@Param('id') id: number, @Body() role) {
    return this.userService.setUserRole(id, role.role);
  }
}
