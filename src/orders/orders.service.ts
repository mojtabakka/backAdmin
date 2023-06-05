import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { isEmptyArray } from 'src/common/utils/functions.utils';
import { ProductStatuses, orderStatus } from 'src/enums/enums.enum';
import { ProductService } from 'src/product/product.service';
import { Orders } from 'src/typeorm/entities/Order';
import { Product } from 'src/typeorm/entities/Product';
import { Basket } from 'src/typeorm/entities/‌Basket';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private userService: UsersService,
    private productService: ProductService,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Basket)
    private basketRepository: Repository<Basket>,
  ) {}

  // async setOrder(
  //   model: string,
  //   userInfo,
  //   res: Response,
  // ): Promise<Orders | undefined> {
  //   try {
  //     let priceForUser: number = 0;
  //     let PriceForColleague: number = 0;

  //     const findOrder: Orders = await this.ordersRepository
  //       .createQueryBuilder('orders')
  //       .innerJoinAndSelect('orders.products', 'products')
  //       .where('orders.status=:status', {
  //         id: userInfo.sub,
  //         status: orderStatus.NotPayed,
  //       })
  //       .getOne();
  //     let products: Product[] = [];
  //     if (findOrder && findOrder.products) {
  //       products = findOrder.products;
  //     }
  //     const user = await this.userService.getPublicUser(userInfo.phoneNumber);
  //     const product = await this.productService.getProductForReserve(model);

  //     if (!product) {
  //       res.status(HttpStatus.NOT_FOUND).json({
  //         message: 'there is no more produc',
  //         data: null,
  //       });
  //       throw new HttpException(
  //         'there is no more produc',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     products.push(product);
  //     products.map((item) => {
  //       priceForUser += Number(item.priceForUser);
  //       PriceForColleague += Number(item.priceForWorkmate);
  //     });

  //     await this.productService.changeProductStatus(
  //       product,
  //       ProductStatuses.Reserved,
  //     );

  //     if (findOrder) {
  //       findOrder.products = products;
  //       findOrder.user = user;
  //       findOrder.priceForWorkmate = PriceForColleague.toString();
  //       findOrder.priceForUser = priceForUser.toString();
  //       return this.ordersRepository.save(findOrder);
  //     } else {
  //       const order = this.ordersRepository.create({
  //         user: user,
  //         products,
  //         // priceForColleague: PriceForColleague.toString(),
  //         // priceForUser: priceForUser.toString(),
  //       });
  //       return this.ordersRepository.save(order);
  //     }
  //   } catch (ex) {
  //     throw new Error(`remove error: ${ex.message}.`);
  //   }
  // }

  async removeOrder(model: string, userInfo, res: Response) {
    try {
      const productInBasket = await this.basketRepository
        .createQueryBuilder('basket')
        .leftJoinAndSelect('basket.products', 'products')
        .where('products.model=:model and userId=:id  ', {
          model,
          id: userInfo?.sub,
        })
        .getOne();

      const products: Product[] = productInBasket.products;
      products.pop();
      productInBasket.products = products;
      await this.basketRepository.save(productInBasket);
      return true;
    } catch (ex) {
      console.log(ex);

      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getNumberOfOrder(model: string, user: any) {
    const productInBasket = await this.basketRepository
      .createQueryBuilder('basket')
      .leftJoinAndSelect('basket.products', 'products')
      .where('userId=:id and products.model=:model', {
        id: user.sub,
        model,
      })
      .getOne();
    return productInBasket && !isEmptyArray(productInBasket.products)
      ? productInBasket?.products?.length
      : 0;
  }

  // async getCurrentOrders(user: any): Promise<Orders[] | undefined> {
  //   const orders = await this.ordersRepository
  //     .createQueryBuilder('orders')
  //     .innerJoinAndSelect('orders.products', 'products')
  //     .where('orders.userId=:id', {
  //       id: user.sub,
  //     })
  //     .getMany();
  //   return orders;
  // }

  async addToBasket(model: string, userInfo: any) {
    try {
      let result;
      const basket = await this.basketRepository
        .createQueryBuilder('basket')
        .leftJoinAndSelect('basket.products', 'product')
        .where('basket.userId=:id', {
          id: userInfo.sub,
        })
        .getOne();
      const user = await this.userService.getPublicUser(userInfo.phoneNumber);
      const product = await this.productService.getProductNotExistInUserBsket(
        model,
        userInfo.sub,
      );
      delete product.baskets;
      if (basket) {
        basket.products = [product, ...basket.products];
        result = await this.basketRepository.save(basket);
      } else {
        const basketForSave = this.basketRepository.create({
          user,
          products: [product],
        });
        result = await this.basketRepository.save(basketForSave);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async getCurrentBasket(userInfo: any): Promise<Basket[] | undefined> {
    try {
      const basket = await this.basketRepository
        .createQueryBuilder('basket')
        .leftJoinAndSelect('basket.products', 'products')
        .leftJoinAndSelect('products.photos', 'productPhotos')
        .where('basket.userId=:id', {
          id: userInfo.sub,
        })
        .groupBy('products.model')
        .addSelect(['COUNT(products.id) as number'])
        .getRawMany();

      return basket;
    } catch (error) {}
  }

  async addOrder(user: any) {}
}
