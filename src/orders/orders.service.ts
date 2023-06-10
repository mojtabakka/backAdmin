import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Response } from 'express';
import { AddressService } from 'src/address/address.service';
import { isEmptyArray, isEmptyObject } from 'src/common/utils/functions.utils';
import { orderStatus } from 'src/enums/enums.enum';
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
    let mySumPrice = 0;
    let mySumFinalPrice = 0;
    let myBenefit = 0;
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

    !isEmptyArray(products) &&
      products.map((item) => {
        const benefitOfPrice = +item?.priceForUser * (+item?.off / 100);
        myBenefit += +item.priceForUser * (+item.off / 100);
        mySumPrice += +item.priceForUser;

        mySumFinalPrice += +(+item.priceForUser - +benefitOfPrice);
      });

    productInBasket.products = products;
    productInBasket.benefit = Math.round(myBenefit);
    productInBasket.finalPrice = Math.round(mySumFinalPrice);
    productInBasket.purePrice = Math.round(mySumPrice);
    await this.basketRepository.save(productInBasket);
    return true;
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

  async addToBasket(model: string, userInfo: any) {
    let result;
    let mySumPrice = 0;
    let mySumFinalPrice = 0;
    let myBefefit = 0;
    let shippingPrice = 29000;
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

    !isEmptyArray([product, ...basket.products]) &&
      [product, ...basket.products].map((item) => {
        const benefitOfPrice = +item?.priceForUser * (+item?.off / 100);
        myBefefit += +item.priceForUser * (+item.off / 100);
        mySumPrice += +item.priceForUser;

        mySumFinalPrice += +(+item.priceForUser - +benefitOfPrice);
      });

    delete product.baskets;
    if (basket) {
      basket.products = [product, ...basket.products];
      basket.purePrice = Math.round(mySumPrice);
      basket.finalPrice = Math.round(mySumFinalPrice);
      basket.benefit = Math.round(myBefefit);
      basket.shippingPrice = shippingPrice;
      result = await this.basketRepository.save(basket);
    } else {
      const basketForSave = this.basketRepository.create({
        user,
        purePrice: Math.round(mySumPrice),
        finalPrice: Math.round(mySumFinalPrice),
        benefit: Math.round(myBefefit),
        products: [product],
        shippingPrice,
      });
      result = await this.basketRepository.save(basketForSave);
    }
    return result;
  }

  async getCurrentBasket(id: number): Promise<Basket[] | undefined> {
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
  }

  async getCurrentBasketWithOutRelations(
    id: number,
  ): Promise<Basket | undefined> {
    const basket = await this.basketRepository
      .createQueryBuilder('basket')
      .where('basket.userId=:id', {
        id,
      })
      .getOne();
    return basket;
  }

  async addOrder(
    shippingTime: string,
    userInfo: any,
  ): Promise<Orders | undefined> {
    let result;

    const currentOrder = await this.getCurrentOrder(userInfo.sub);
    const cart = await this.getCurrentBasketWithOutRelations(userInfo.sub);
    const price = Math.round(cart.finalPrice);
    const finalPrice = Math.round(cart.finalPrice - cart.shippingPrice);
    const shippingPrice = cart.shippingPrice;
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
        shippingPrice,
        price,
        finalPrice,
      });
      result = await this.ordersRepository.save(order);
    } else {
      currentOrder.shippingPrice = shippingPrice;
      currentOrder.shippingTime = shippingTime;
      currentOrder.cart = cart;
      currentOrder.address = activeAddress;
      currentOrder.price = price;
      currentOrder.finalPrice = finalPrice;
      result = await this.ordersRepository.save(currentOrder);
    }
    return result;
  }

  async getCurrentOrder(id: number): Promise<Orders | undefined> {
    return this.ordersRepository
      .createQueryBuilder('orders')
      .where('userId=:id and status=:status', {
        id,
        status: orderStatus.NotPayed,
      })
      .getOne();
  }

  async getCurrentOrders(id: number): Promise<Orders[] | undefined> {
    const result = await this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.cart', 'cart')
      .leftJoinAndSelect('cart.products', 'products')
      .leftJoinAndSelect('products.photos', 'photos')
      .where('NOT orders.status=:status  and orders.userId=:id', {
        status: orderStatus.Completed,
        id,
      })
      .getMany();
    return result;
  }

  async getPreviousOrders(id: number): Promise<Orders[] | undefined> {
    const result = await this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.cart', 'cart')
      .leftJoinAndSelect('cart.products', 'products')
      .leftJoinAndSelect('products.photos', 'photos')
      .where('orders.status=:status  and orders.userId=:id', {
        status: orderStatus.Completed,
        id,
      })
      .getMany();
    return result;
  }

  async getOrders(status: string): Promise<Orders[] | undefined> {
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
  }

  async changeOrderStatus(id: number, state: string) {
    const result = await this.ordersRepository
      .createQueryBuilder('orders')
      .update(Orders)
      .set({ status: state })
      .where('id=:id', {
        id: id,
      })
      .execute();
    return result;
  }
}
