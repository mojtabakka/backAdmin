import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Response } from 'express';
import { AddressService } from 'src/address/address.service';
import { isEmptyArray, isEmptyObject } from 'src/common/utils/functions.utils';
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
    private addressService: AddressService,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Basket)
    private basketRepository: Repository<Basket>,
  ) {}

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
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getNumberOfOrder(model: string, user: any) {
    try {
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
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

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

  async getCurrentBasket(id: number): Promise<Basket[] | undefined> {
    try {
      const basket = await this.basketRepository
        .createQueryBuilder('basket')
        .leftJoinAndSelect('basket.products', 'products')
        .leftJoinAndSelect('products.photos', 'productPhotos')
        .where('basket.userId=:id', {
          id,
        })
        .groupBy('products.model')
        .addSelect(['COUNT(products.id) as number'])
        .getRawMany();

      return basket;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getCurrentBasketWithOutRelations(
    id: number,
  ): Promise<Basket | undefined> {
    try {
      const basket = await this.basketRepository
        .createQueryBuilder('basket')
        .where('basket.userId=:id', {
          id,
        })
        .getOne();
      return basket;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async addOrder(
    shippingTime: string,
    userInfo: any,
  ): Promise<Orders | undefined> {
    try {
      let result;
      const currentOrder = await this.getCurrentOrder(userInfo.sub);
      const cart = await this.getCurrentBasketWithOutRelations(userInfo.sub);
      const activeAddress = await this.addressService.getActiveAddress(
        userInfo?.sub,
      );
      if (isEmptyObject(currentOrder)) {
        const user = await this.userService.getPublicUser(userInfo.phoneNumber);
        const order = this.ordersRepository.create({
          user,
          address: activeAddress,
          cart: cart,
          status: orderStatus.NotPayed,
          shippingTime,
        });
        result = await this.ordersRepository.save(order);
      } else {
        currentOrder.shippingTime = shippingTime;
        currentOrder.cart = cart;
        currentOrder.address = activeAddress;
        result = await this.ordersRepository.save(currentOrder);
      }
      return result;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getCurrentOrder(id: number): Promise<Orders | undefined> {
    try {
      return this.ordersRepository
        .createQueryBuilder('orders')
        .where('userId=:id and status=:status', {
          id,
          status: orderStatus.NotPayed,
        })
        .getOne();
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getCurrentOrders(id: number): Promise<Orders | undefined> {
    try {
      return this.ordersRepository
        .createQueryBuilder('orders')
        .where('userId=:id and  NOT status=:status', {
          id,
          status: orderStatus.Completed,
        })
        .getOne();
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getOrders(status: string): Promise<Orders[] | undefined> {
    try {
      return this.ordersRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.address', 'address')
        .leftJoinAndSelect('orders.cart', 'cart')
        .leftJoinAndSelect('cart.products', 'products')
        .leftJoinAndSelect('orders.user', 'user')
        .leftJoinAndSelect('products.photos', 'photos')
        .where('orders.status=:status', {
          status,
        })
        .getMany();
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async changeOrderStatus(id: number, state: string) {
    try {
      const result = await this.ordersRepository
        .createQueryBuilder('orders')
        .update(Orders)
        .set({ status: state })
        .where('id=:id', {
          id: id,
        })
        .execute();
      return result;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }
}
