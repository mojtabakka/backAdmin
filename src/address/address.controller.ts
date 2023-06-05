import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/enums/enums.enum';
import { AddressService } from './address.service';
import { createAddressDto } from './dtos/createAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Roles(Role.User)
  @Get()
  async getAddresses(@Req() req, @Res() res) {
    try {
      const address = await this.addressService.getAddresses(req.user);
      res.status(HttpStatus.OK).json({
        message: 'successfully',
        data: address,
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }

  @Roles(Role.User)
  @Get('get-active-address')
  async getActiveAddress(@Req() req, @Res() res) {
    try {
      const address = await this.addressService.getActiveAddress(req.user);
      res.status(HttpStatus.OK).json({
        message: 'successfully',
        data: address,
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }

  @Roles(Role.User)
  @Post()
  async createAddress(
    @Body() createAddressDto: createAddressDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const address = await this.addressService.createAddress(
        createAddressDto,
        req.user,
      );
      res.status(HttpStatus.OK).json({
        message: 'address created successfully',
        data: address,
      });
    } catch (error) {
      console.log(error);
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }

  @Roles(Role.User)
  @Post('change-active-address/:id')
  async changeActiveAddress(
    @Param('id') id: number,
    @Req()
    req,
    @Res() res,
  ) {
    try {
      await this.addressService.changeActiveAddress(id, req.user);
      res.status(HttpStatus.OK).json({
        message: 'active address changed successfully',
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }
}
