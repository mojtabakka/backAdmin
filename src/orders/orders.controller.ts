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
import { Role } from 'src/enums/enums.enum';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  // @Roles(Role.User)
  // @Post()
  // async setOrder(@Body() model: { model: string }, @Req() req, @Res() res) {
  //   try {
  //     await this.orderService.setOrder(model.model, req.user, res);
  //     res.status(HttpStatus.OK).json({
  //       message: 'order recorded successfully',
  //       data: null,
  //     });
  //   } catch (error) {}
  // }

  @Roles(Role.User)
  @Delete('remove-prodcuct-from-basket/:model')
  async RemoveOrder(@Param('model') model: string, @Req() req, @Res() res) {
    try {
      await this.orderService.removeOrder(model, req.user, res);
      res.status(HttpStatus.OK).json({
        message: 'order recorded successfully',
        data: null,
      });
    } catch (error) {}
  }

  @Roles(Role.User)
  @Get('current-orders')
  async getCurrentOrders(@Req() req, @Res() res) {
    // try {
    //   const orders = await this.orderService.getCurrentOrders(req.user);
    //   res.status(HttpStatus.OK).json({
    //     message: 'successfully',
    //     data: orders,
    //   });
    // } catch (error) {}
  }

  @Roles(Role.User)
  @Get('number-of-product-in-basket/:model')
  async getNumberOfOrder(
    @Param('model') model: string,
    @Req() req,
    @Res() res,
  ) {
    try {
      const numberOfOrder = await this.orderService.getNumberOfOrder(
        model,
        req.user,
      );
      res.status(HttpStatus.OK).json({
        message: 'successfully',
        data: { number: numberOfOrder },
      });
    } catch (error) {
    } finally {
    }
  }

  @Roles(Role.User)
  @Post('addToBasket')
  async addToBasket(@Body('model') model: string, @Req() req, @Res() res) {
    try {
      const orders = await this.orderService.addToBasket(model, req.user);
      res.status(HttpStatus.OK).json({
        message: 'prodcut added to basket successfully',
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }

  @Roles(Role.User)
  @Get('getCurrentBasket')
  async getCurrentBasket(@Req() req, @Res() res) {
    try {
      const data = await this.orderService.getCurrentBasket(req.user);
      res.status(HttpStatus.OK).json({
        message: 'Successfully',
        data,
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }

  @Roles(Role.User)
  @Post('getCurrentBasket')
  async addOrder(@Req() req, @Res() res) {
    try {
      const data = await this.orderService.getCurrentBasket(req.user);
      res.status(HttpStatus.OK).json({
        message: 'Successfully',
        data,
      });
    } catch (error) {
      res.status(error.status).json({
        mesxsage: error.response,
      });
    }
  }
}
