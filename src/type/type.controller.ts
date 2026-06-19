import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { TypeService } from './type.service';
import { CreateBrandDto } from './dtos/createBrand.dto';
import { CreateTypeDto } from './dtos/createType.dto';
import { PageOptionsDto } from 'src/dtos';

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
  async getProductTypes(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
    const data = await this.typeService.getProductTypes(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteProductTypes(@Res() res, @Param('id') id: number) {
    const data = await this.typeService.DeleteProdcutType(id);
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

  @Put('edit-brand/:id')
  @Roles(Role.Admin)
  async editBrand(
    @Body() CreateBrandDto: CreateBrandDto,
    @Param('id') id: number,
    @Res() res,
  ) {
    const data = await this.typeService.editBrand(id, CreateBrandDto);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Put(':id')
  @Roles(Role.Admin)
  async editProductType(
    @Body() createTypeDto: CreateTypeDto,
    @Param('id') id: number,
    @Res() res,
  ) {
    const data = await this.typeService.editProdcutType(id, createTypeDto);
    res.status(HttpStatus.OK).json({
      data,
    });
  }

  @Get('get-brands')
  @Roles(Role.Admin)
  async getBrands(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
    const data = await this.typeService.getBrands(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getPr(@Res() res, @Param('id') id: number) {
    const data = await this.typeService.getProdcutType(id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-brand/:id')
  @Roles(Role.Admin)
  async getBrand(@Res() res, @Param('id') id: number) {
    const data = await this.typeService.getBrand(id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Delete('delete-brand/:id')
  @Roles(Role.Admin)
  async RemoveBrand(@Param('id') id: number, @Res() res) {
    const data = await this.typeService.deleteBrand(id);
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
  async getProperties(
    @Req() req,
    @Res() res,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const data = await this.typeService.getProperties(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }
}
