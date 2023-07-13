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
}
