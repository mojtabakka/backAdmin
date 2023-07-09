import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { TypeService } from './type.service';
import { CreateCatDto } from '../category/dtos/createCat.dto';
import { CreateBrandDto } from './dtos/createBrand.dto';
import { CreateTypeDto } from './dtos/createType.dto';

@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}
  @Post()
  @Roles(Role.Admin)
  async CreateProduct(@Body() createTypeDto: CreateTypeDto, @Res() res) {
    const data = await this.typeService.createProductType(createTypeDto);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Get()
  @Roles(Role.Admin)
  async getProductTypes(@Res() res) {
    const data = await this.typeService.getProductTypes();
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Post('add-brand')
  @Roles(Role.Admin)
  async addBrands(@Body() CreateBrandDto: CreateBrandDto, @Res() res) {
    const data = await this.typeService.addBrands(CreateBrandDto);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Get('get-brands')
  @Roles(Role.Admin)
  async getBrands(@Res() res) {
    const data = await this.typeService.getBrands();
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }


  @Post('add-property')
  @Roles(Role.Admin)
  async addProperty(@Body() body, @Req() req, @Res() res) {
    const data = await this.typeService.addProperty(body);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-properties')
  @Roles(Role.Admin)
  async getProperties(@Req() req, @Res() res) {
    const data = await this.typeService.getProperties();
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }
}
