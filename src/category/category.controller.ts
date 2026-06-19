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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/constants';
import { Roles } from 'src/decorators/roldes.decorator';
import { CreateCatDto } from 'src/category/dtos/createCat.dto';
import { CategoryService } from './category.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { diskStorage } from 'multer';
import { PageOptionsDto } from 'src/dtos';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  @Roles(Role.Admin)
  async createCat(@Body() createCatDto: CreateCatDto, @Res() res) {
    const data = await this.categoryService.createCat(createCatDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Put(':id')
  @Roles(Role.Admin)
  async editCategory(
    @Body() createCatDto: CreateCatDto,
    @Res() res,
    @Param('id') id: number,
  ) {
    const data = await this.categoryService.EditCategory(id, createCatDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get()
  @Public()
  async getcats(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
    const data = await this.categoryService.getCats(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Post('upload-category-image')
  @Public()
  // @Roles(Role.Admin)
  @UseInterceptors(
    FilesInterceptor('photo', 20, {
      storage: diskStorage({
        destination: 'public/asset/images/category',
        filename: (req, file, cb) => {
          console.log(file);
          cb(null, Date.now() + '_category' + file.originalname);
        },
      }),
    }),
  )
  async uploadCategoryImage(
    @UploadedFiles() file,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const src =
      req.protocol + '://' + req.hostname + ':3003/' + file[0].path.slice(7);
    res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully',
      data: {
        src,
      },
    });
  }

  @Get('get-cat')
  @Public()
  async getCat(@Query() query, @Res() res) {
    const data = await this.categoryService.getCat(query.id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Get('get-cat')
  @Public()
  async getCatAdmin(@Query() query, @Res() res) {
    const data = await this.categoryService.getCat(query.id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteProperty(@Res() res, @Param('id') id: string) {
    const deletedProperty = await this.categoryService.removeCategory(id);
    if (!deletedProperty) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Property not found',
      });
    }
    res.status(HttpStatus.OK).json({ message: 'deleted successfully' });
  }
}
