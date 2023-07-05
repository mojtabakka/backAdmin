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
import { ProductService } from './product.service';
import { Response, Request } from 'express';
import { CreateProductDto } from './dtos/createProduct.dto';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { EditProductDto } from './dtos/editProduct.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/auth/decorators/public.decorator';
import { Product } from 'src/typeorm/entities/Product';
import { PageOptionsDto } from 'src/dtos';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Roles(Role.Admin)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const data: Product[] | undefined = await this.productService.createProduct(
      createProductDto,
      createProductDto.numberOfExist,
      req.user.username,
    );

    res.status(HttpStatus.OK).json({
      message: 'productCreated successfully',
      data,
    });
  }

  @Post('upload-product-image')
  @Roles(Role.Admin)
  @UseInterceptors(
    FilesInterceptor('photo', 20, {
      storage: diskStorage({
        destination: 'public/asset/images/products',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_product' + file.originalname);
        },
      }),
    }),
  )
  async uploadProductImage(
    @UploadedFiles() file,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const src =
      req.protocol + '://' + req.hostname + ':3003/' + file[0].path.slice(7);
    const data = await this.productService.uploadProductImage(src);
    res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully',
      data,
    });
  }

  @Get()
  @Public()
  async getProducts(
    @Query() pageOptionsDto: PageOptionsDto,
    @Res() res: Response,
  ) {
    const data = await this.productService.getProducts(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      message: 'products recieved successfully',
      ...data,
    });
  }

  @Get('public')
  @Public()
  async getProductsPublic(
    @Query() query,
    @Query() pageOptionsDto: PageOptionsDto,
    @Res() res: Response,
  ) {
    const data = await this.productService.getProductsForPublic(
      query,
      pageOptionsDto,
    );
    res.status(HttpStatus.OK).json({
      message: 'products recieved successfully',
      ...data,
    });
  }

  @Get('/public/:id')
  @Public()
  async getProductPublic(@Param('id') model: string, @Res() res: Response) {
    const data = await this.productService.getProductForPublic(model);
    res.status(HttpStatus.OK).json({
      message: 'product recieved successfully',
      data,
    });
  }

  @Get(':id')
  @Public()
  async getProduct(@Param('id') id: number, @Res() res: Response) {
    const data = await this.productService.getProduct(id);
    res.status(HttpStatus.OK).json({
      message: 'product recieved successfully',
      data,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: number, @Res() res: Response) {
    await this.productService.deleteProduct(id);
    res.status(HttpStatus.OK).json({
      message: 'Product Deleted Successfully',
    });
  }

  @Put(':id')
  @Roles(Role.Admin)
  async editProduct(
    @Param('id') id: number,
    @Body() editProductDto: EditProductDto,
    @Res() res: Response,
  ) {
    const data = await this.productService.editProduct(id, editProductDto);
    res.status(HttpStatus.OK).json({
      message: 'Product Updated successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Get('public/product-search/product-search')
  async serchProduct(@Query() search, @Res() res: Response) {
    const data = await this.productService.searchProduct(search.search);
    res.status(HttpStatus.OK).json({
      message: 'Product Updated successfully',
      data,
    });
  }
}
