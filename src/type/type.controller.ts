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
import { Role } from 'src/enums/enums.enum';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}
  @Post()
  @Roles(Role.Admin)
  async CreateProduct(
    @Body() body: { type: string; title: string },
    @Req() req,
    @Res() res,
  ) {
    const data = await this.typeService.createProductType(body);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Get()
  @Roles(Role.Admin)
  async getProductTypes(@Req() req, @Res() res) {
    const data = await this.typeService.getProductTypes();
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Post('add-brand')
  @Roles(Role.Admin)
  async addBrands(
    @Body() body: { brand: string; title: string },
    @Req() req,
    @Res() res,
  ) {
    const data = await this.typeService.addBrands(body);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Post('get-brands')
  @Roles(Role.Admin)
  async getBrands(@Req() req, @Res() res) {
    const data = await this.typeService.getBrands();
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Post('cat')
  @Roles(Role.Admin)
  async createCat(@Body() body, @Req() req, @Res() res) {
    const data = await this.typeService.createCat(body);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-cats')
  @Roles(Role.Admin)
  async getcat(@Body() body, @Req() req, @Res() res) {
    const data = await this.typeService.getCats();
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-cat')
  @Roles(Role.Admin)
  async getca(@Query() query, @Req() req, @Res() res) {
    const data = await this.typeService.getCat(
      query.id,
      query.brand,
      query.productType,
    );
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
}
