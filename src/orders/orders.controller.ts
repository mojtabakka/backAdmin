import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roldes.decorator';
import { Role } from 'src/constants';
import { OrdersService } from './orders.service';
import { SearchOrderDto } from './dtos/serchOrder.dto';
import { PageOptionsDto } from 'src/dtos';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Roles(Role.User)
  @Delete('remove-prodcuct-from-basket/:model')
  async RemoveOrder(@Param('model') model: string, @Req() req, @Res() res) {
    const data = await this.orderService.removeOrder(model, req.user, res);

    res.status(HttpStatus.OK).json({
      message: 'order recorded successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Get('current-orders')
  async getCurrentOrders(@Req() req, @Res() res) {
    console.log('hello');

    const orders = await this.orderService.getCurrentOrders(req.user.sub);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: orders,
    });
  }

  @Roles(Role.User)
  @Get('previous-orders')
  async getPreviousOrders(@Req() req, @Res() res) {
    const orders = await this.orderService.getPreviousOrders(req.user.sub);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: orders,
    });
  }

  @Roles(Role.User)
  @Get('number-of-product-in-basket/:model')
  async getNumberOfOrder(
    @Param('model') model: string,
    @Req() req,
    @Res() res,
  ) {
    const numberOfOrder = await this.orderService.getNumberOfOrder(
      model,
      req.user,
    );
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data: { number: numberOfOrder },
    });
  }

  @Roles(Role.User)
  @Post('addToBasket')
  async addToBasket(@Body() ids: Array<number>, @Req() req, @Res() res) {
    const data = await this.orderService.addToBasket(ids, req.user);
    res.status(HttpStatus.OK).json({
      message: 'prodcut added to basket successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Get('getCurrentBasket')
  async getCurrentBasket(@Req() req, @Res() res) {
    const data = await this.orderService.getCurrentBasket(req.user.sub);
    res.status(HttpStatus.OK).json({
      message: 'Successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Public()
  @Get('get-current-basket-count')
  async getCurrentBasketCount(@Req() req, @Res() res) {
    const data = await this.orderService.getCurrentBasketCount(req.user.sub);
    res.status(HttpStatus.OK).json({
      message: 'Successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Post()
  async addOrder(@Body() shipingTime, @Req() req, @Res() res) {
    const data = await this.orderService.addOrder(
      shipingTime.shippingTime,
      req.user,
    );
    res.status(HttpStatus.OK).json({
      message: 'order added successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Get('get-current-order')
  async getCurrentOrder(@Req() req, @Res() res) {
    const data = await this.orderService.getCurrentOrder(req.user.sub);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Roles(Role.Admin)
  @Get()
  async getOrders(@Query() query, @Req() req, @Res() res) {
    const data = await this.orderService.getOrders(query.status);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Get('get-order/:id')
  async getOrder(@Param('id') id: number, @Res() res) {
    const data = await this.orderService.getOrder(id);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Roles(Role.Admin)
  @Patch('change-order-status/:id')
  async changeOrderStatus(
    @Param('id') id: number,
    @Body() status,
    @Req() req,
    @Res() res,
  ) {
    const data = await this.orderService.changeOrderStatus(id, status.state);
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Roles(Role.User)
  @Patch('change-order-status-public/:id')
  async changeOrderStatusPublic(
    @Param('id') id: number,
    @Body() status,
    @Res() res,
  ) {
    const data = await this.orderService.changeOrderStatusPublic(
      id,
      status.state,
    );
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      data,
    });
  }

  @Roles(Role.Admin)
  @Get('search-order-admin')
  async searchProductsAdmin(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchOrderDto: SearchOrderDto,
    @Res() res,
  ) {
    const data = await this.orderService.searchOrder(
      searchOrderDto,
      pageOptionsDto,
    );
    res.status(HttpStatus.OK).json({
      message: 'successfully',
      ...data,
    });
  }
}
