import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Repository } from 'typeorm';
import { CreateProduct } from './utils/createProduct';
import { UsersService } from 'src/users/users.service';
import { EditProduct } from './utils/types';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { ProductStatuses } from 'src/enums/enums.enum';
import { isEmptyArray } from 'src/common/utils/functions.utils';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
    private usersService: UsersService,
  ) {}

  async createProduct(
    detailCreateProduct: CreateProduct,
    numberOfExist: number,
    username: string,
  ): Promise<Product[] | undefined> {
    try {
      const products: Product[] = [];
      const features = JSON.stringify(detailCreateProduct.features);
      const productPhoto: ProductPhoto[] = [];
      const photo = await this.productPhotoRepository.findOneBy({
        src: detailCreateProduct.photo,
      });
      productPhoto.push(photo);
      const user = await this.usersService.findOne(username);
      delete detailCreateProduct.numberOfExist;

      for (let i: number = 0; i < Number(numberOfExist); i++) {
        products.push(
          this.productRepository.create({
            ...detailCreateProduct,
            features,
            author: user,
            photos: productPhoto,
          }),
        );
      }
      const product = await this.productRepository.save(products);

      return { ...product };
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  uploadProductImage(src: string) {
    try {
      if (!src) {
        throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
      }
      const photoUrl = this.productPhotoRepository.create({ src });
      return this.productPhotoRepository.save(photoUrl);
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getProducts() {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getProductsForPublic(): Promise<Product[] | undefined> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.photos', 'photos')
        .groupBy('product.model')
        .select('*')
        .addSelect(['COUNT(product.id) as numberOfExist'])
        .getRawMany();
      return products;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getProductForPublic(model: string): Promise<Product | undefined> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.photos', 'photos')
        .groupBy('product.model')
        .where('product.model = :model', { model: model.trim() })
        .getOne();

      return product;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  getProduct(id: number) {
    try {
      return this.productRepository.findOneBy({ id });
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  deleteProduct(id: number) {
    try {
      return this.productRepository.delete(id);
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async editProduct(id: number, detailEditProduct: EditProduct) {
    try {
      const updateProduct = await this.productRepository.update(id, {
        ...detailEditProduct,
        features: JSON.stringify(detailEditProduct.features),
      });
      return updateProduct;
    } catch (ex) {
      throw new Error(`remove error: ${ex.message}.`);
    }
  }

  async getProductForReserve(model: string): Promise<Product | undefined> {
    try {
      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .where('product.model=:model && product.status IS NULL', { model })
        .getOne();
      return updateProduct;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getProductForReomve(model: string): Promise<Product | undefined> {
    try {
      const updateProduct = await this.productRepository
        .createQueryBuilder('product')
        .where('product.model=:model && product.status=:status', {
          model,
          status: ProductStatuses.Reserved,
        })
        .getOne();
      return updateProduct;
    } catch (error) {
      console.log('error', error);
    }
  }

  async changeProductStatus(product: Product, status: string) {
    try {
      product.status = status;
      this.productRepository.save(product);
    } catch (error) {
      console.log('error', error);
    }
  }

  async getProductNotExistInUserBsket(
    model: string,
    id: number,
  ): Promise<Product | undefined> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.baskets', 'basket')
        .where(
          'product.model=:model and (  basket.userId=:id or basket.userId IS NULL )',
          {
            model,
            id,
          },
        )
        .getMany();

      const products2 = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.baskets', 'basket')
        .where('product.model=:model and ( basket.userId=:id )', {
          model,
          id,
        })
        .getMany();
      const finalProducts = products.map((item) => {
        if (!products2.find((el) => el.id == item.id)) {
          return item;
        }
        return null;
      });
      const procutsNotExist = finalProducts.filter((item) => item !== null);
      if (isEmptyArray(procutsNotExist)) {
        throw new HttpException(
          'there is no more product ',
          HttpStatus.NOT_FOUND,
        );
      }

      return finalProducts.filter((item) => item !== null)[0];
    } catch (error) {
      throw new HttpException('there is no more product', HttpStatus.NOT_FOUND);
    }
  }
}
