import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AddressService } from 'src/address/address.service';
import { isEmptyArray, isEmptyObject } from 'src/common/utils/functions.utils';
import { orderStatus } from 'src/constants';
import { ProductService } from 'src/product/product.service';
import { Orders } from 'src/typeorm/entities/Order';
import { Product } from 'src/typeorm/entities/Product';
import { Basket } from 'src/typeorm/entities/‌Basket';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { searchOrder } from './utils/types/searchOrder';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';

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
    const result = await this.basketRepository.save(productInBasket);

    return result;
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

  async addToBasket(ids, userInfo: any) {
    let purePrice = 0;
    let finalPrice = 0;
    let benefit = 0;
    let shippingPrice = 29000;
    const user = await this.userService.getPublicUser(userInfo.phoneNumber);
    console.log(user);
    
    let products = await this.productService.getProductsWithIds(ids);

    !isEmptyArray(products);
    products.map((item) => {
      const benefitOfPrice = +item?.priceForUser * (+item?.off / 100);
      benefit += +item.priceForUser * (+item.off / 100);
      purePrice += +item.priceForUser;
      finalPrice += +(+item.priceForUser - +benefitOfPrice);
    });

    if (!products) {
      products = [];
    }

    console.log(userInfo);
    
    let basket = await this.basketRepository
      .createQueryBuilder('basket')
      .leftJoinAndSelect('basket.user', 'user')
      .where('user.id=:id', {
        id: userInfo.sub,
      })
      .getOne();
      console.log(basket);
      

    if (!basket) {
      console.log('hello');
      
      basket = this.basketRepository.create({
        products: products,
        // user,
        shippingPrice: shippingPrice,
        benefit: benefit,
        purePrice,
        finalPrice,
      });

      return this.basketRepository.save(basket);
    }

    basket.products = products;
    basket.shippingPrice = shippingPrice;
    basket.finalPrice = finalPrice;
    basket.purePrice = purePrice;
    basket.benefit = benefit;
    const result = await this.basketRepository.save(basket);

    return result;
  }

  async getCurrentBasket(id: number): Promise<Basket | undefined | null> {
    const queryBuilder = await this.basketRepository
      .createQueryBuilder('basket')
      .leftJoinAndSelect('basket.products', 'products')
      .leftJoinAndSelect('products.photos', 'productPhotos')
      .where('basket.userId=:id', {
        id,
      })
      .getOne();
    return queryBuilder;
  }

  async getCurrentBasketwithOutGorupBy(
    id: number,
  ): Promise<Basket | undefined> {
    const basket = await this.basketRepository
      .createQueryBuilder('basket')
      .leftJoinAndSelect('basket.products', 'products')
      .where('basket.userId=:id', {
        id,
      })
      .getOne();
    return basket;
  }

  async getCurrentBasketCount(id: number): Promise<Number> {
    const basket = await this.basketRepository
      .createQueryBuilder('basket')
      .leftJoinAndSelect('basket.products', 'products')
      .where('basket.userId=:id', {
        id,
      })
      .getOne();

    return basket?.products ? basket.products.length : 0;
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
    const cart = await this.getCurrentBasketwithOutGorupBy(userInfo.sub);
    const products = cart.products;
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
        products,
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
      currentOrder.products = products;
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
    if (state == orderStatus.Payed) {
      const order = await this.ordersRepository.findOne({
        relations: {
          user: true,
        },
        where: { id },
      });
      const userId = order.user.id;
      const basket = await this.basketRepository
        .createQueryBuilder('basket')
        .where('userId=:userId', { userId })
        .getOne();
      basket.purePrice = null;
      basket.finalPrice = null;
      basket.benefit = null;
      basket.shippingPrice = null;
      basket.products = [];
      const result = await this.basketRepository.save(basket);
    }
    return null;
  }

  async getOrder(id: number): Promise<Orders | undefined> {
    const result = await this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.address', 'address')
      .leftJoinAndSelect('orders.products', 'products')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('products.photos', 'photos')
      .where('orders.id=:id', { id })
      .getOne();
    return result;
  }

  async searchOrder(
    searchOrderDetail: searchOrder,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Orders>> {
    const {
      name,
      lastName,
      nationalCode,
      phoneNumber,
      model,
      state,
      city,
      status,
    } = searchOrderDetail;
    let queryBuilder = this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.address', 'address')
      .leftJoinAndSelect('orders.products', 'products')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('products.photos', 'photos');
    if (name) {
      queryBuilder.where('user.name LIKE :name ', { name: `%${name}%` });
    }
    if (lastName) {
      queryBuilder.andWhere('user.lastName LIKE :lastName ', {
        lastName: `%${lastName}%`,
      });
    }
    if (phoneNumber) {
      queryBuilder.andWhere('user.phoneNumber LIKE :phoneNumber ', {
        phoneNumber: `%${phoneNumber}%`,
      });
    }
    if (nationalCode) {
      queryBuilder.andWhere('user.nationalCode LIKE :nationalCode ', {
        nationalCode: `%${nationalCode}%`,
      });
    }
    if (model) {
      queryBuilder.andWhere('products.model LIKE :model ', {
        model: `%${model}%`,
      });
    }
    if (state) {
      queryBuilder.andWhere('address.state LIKE  :state ', {
        state: `%${state}%`,
      });
    }
    if (city) {
      queryBuilder.andWhere('address.city LIKE :city ', {
        city: `%${city}%`,
      });
    }

    if (status) {
      queryBuilder.andWhere('orders.status=:status ', {
        status,
      });
    }

    queryBuilder.orderBy('orders.created_at', pageOptionsDto.order);
    // .offset(pageOptionsDto.skip)
    // .limit(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
