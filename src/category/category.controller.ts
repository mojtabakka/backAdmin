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
import { Role } from 'src/constants';
import { Roles } from 'src/decorators/roldes.decorator';
import { CreateCatDto } from 'src/category/dtos/createCat.dto';
import { CategoryService } from './category.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private typeService: CategoryService) {}
  @Post()
  @Roles(Role.Admin)
  async createCat(@Body() createCatDto: CreateCatDto, @Res() res) {    
    const data = await this.typeService.createCat(createCatDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get()
  @Public()
  async getcats(@Res() res) {
    const data = await this.typeService.getCats();
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-cat')
  @Roles(Role.Admin)
  async getCat(@Query() query, @Res() res) {

    const data = await this.typeService.getCat(query.id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }
}
