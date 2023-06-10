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
import { Role } from 'src/enums/enums.enum';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Roles(Role.User)
  @Delete('remove-prodcuct-from-basket/:model')
  async RemoveOrder(@Param('model') model: string, @Req() req, @Res() res) {
    await this.orderService.removeOrder(model, req.user, res);
    res.status(HttpStatus.OK).json({
      message: 'order recorded successfully',
      data: null,
    });
  }

  @Roles(Role.User)
  @Get('current-orders')
  async getCurrentOrders(@Req() req, @Res() res) {
    const orders = await this.orderService.getCurrentOrders(req.user);
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
  async addToBasket(@Body('model') model: string, @Req() req, @Res() res) {
    const orders = await this.orderService.addToBasket(model, req.user);
    res.status(HttpStatus.OK).json({
      message: 'prodcut added to basket successfully',
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
}