import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { AddressService } from './address.service';
import { createAddressDto } from './dtos/createAddress.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Roles(Role.User)
  @Get()
  async getAddresses(@Req() req, @Res() res) {
    const address = await this.addressService.getAddresses(req.user);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: address,
    });
  }

  @Roles(Role.User)
  @Get('get-active-address')
  async getActiveAddress(@Req() req, @Res() res) {
    const address = await this.addressService.getActiveAddress(req.user.sub);
    console.log(address);

    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: address,
    });
  }

  @Roles(Role.User)
  @Delete(':id')
  async deleteAddress(@Param('id') id: number, @Res() res) {
    const address = await this.addressService.deleteAddress(id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: address,
    });
  }

  @Roles(Role.User)
  @Post()
  async createAddress(
    @Body() createAddressDto: createAddressDto,
    @Req() req,
    @Res() res,
  ) {
    const address = await this.addressService.createAddress(
      createAddressDto,
      req.user,
    );
    res.status(HttpStatus.OK).json({
      message: 'address created successfully',
      data: address,
    });
  }

  @Roles(Role.User)
  @Post('change-active-address/:id')
  async changeActiveAddress(
    @Param('id') id: number,
    @Req()
    req,
    @Res() res,
  ) {
    await this.addressService.changeActiveAddress(id, req.user);
    res.status(HttpStatus.OK).json({
      message: 'active address changed successfully',
    });
  }

  @Public()
  @Get('get-weather')
  async getWeather(@Res() res) {
    console.log('hello');
    const data = {
      today: {
        temp: 10,
        status: 'sunny',
      },

      Sun: {
        temp: 10,
        status: 'sunny',
      },

      Mon: {
        temp: 10,
        status: 'sunny',
      },
      Tues: {
        temp: 10,
        status: 'sunny',
      },
      Wed: {
        temp: 10,
        status: 'sunny',
      },
      Thurs: {
        temp: 10,
        status: 'sunny',
      },
      Fri: {
        temp: 10,
        status: 'sunny',
      },
    };
    res.status(HttpStatus.OK).json({
      message: 'active address changed successfully',
      data,
    });
  }
}
