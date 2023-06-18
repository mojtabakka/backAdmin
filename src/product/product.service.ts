import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Repository } from 'typeorm';
import { CreateProduct } from './utils/createProduct';
import { UsersService } from 'src/users/users.service';
import { EditProduct } from './utils/types';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { ProductStatuses } from 'src/enums/enums.enum';
import {
  getWordsonPersiankyboard,
  isEmptyArray,
} from 'src/common/utils/functions.utils';
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
          brands: detailCreateProduct.brands,
          productTypes: detailCreateProduct.types,
          categories: [{ id: detailCreateProduct.categories }],
        }),
      );
    }
    const product = await this.productRepository.save(products)
    return { ...product };
  }

  uploadProductImage(src: string) {
    if (!src) {
      throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
    }
    const photoUrl = this.productPhotoRepository.create({ src });
    return this.productPhotoRepository.save(photoUrl);
  }

  async getProducts() {
    console.log('heejl');

    const products = await this.productRepository
      .createQueryBuilder('product')
      .groupBy('product.model')
      .select('*')
      .addSelect(['COUNT(product.id) as numberOfExist'])
      .getRawMany();
    return products;
  }

  async getProductsForPublic(): Promise<Product[] | undefined> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.brands', 'brands')
      .leftJoinAndSelect('product.productTypes', 'types')
      .leftJoinAndSelect('product.categories', 'category')
      .groupBy('product.model')
      .select('*')
      .addSelect(['COUNT(product.id) as numberOfExist'])
      .getRawMany();
    return products;
  }

  async getProductForPublic(model: string): Promise<Product | undefined> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photos', 'photos')
      .groupBy('product.model')
      .where('product.model = :model', { model: model.trim() })
      .getOne();
    return product;
  }

  getProduct(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: {
        brands: true,
        productTypes: true,
        categories: true,
      },
    });
  }

  deleteProduct(id: number) {
    return this.productRepository.delete(id);
  }

  async editProduct(id: number, detailEditProduct: EditProduct) {
    const brands = detailEditProduct.brands;
    const productTypes = detailEditProduct.types;
    const categories = detailEditProduct.categories;
    delete detailEditProduct.types;
    delete detailEditProduct.brands;
    delete detailEditProduct.categories;
    detailEditProduct.off = Number(detailEditProduct.off);
    detailEditProduct.features = JSON.stringify(detailEditProduct.features);
    const updateProduct = await this.productRepository
      .createQueryBuilder('product')
      .update(Product)
      .set({
        ...detailEditProduct,
      })
      .where('id = :id', { id })
      .execute();

    const product = await this.productRepository.findOneBy({ id });

    product.brands = brands;
    product.productTypes = productTypes;
    product.categories = categories;

    const result = this.productRepository.save(product);
    return result;
  }

  async getProductForReserve(model: string): Promise<Product | undefined> {
    const updateProduct = await this.productRepository
      .createQueryBuilder('product')
      .where('product.model=:model && product.status IS NULL', { model })
      .getOne();
    return updateProduct;
  }

  async getProductForReomve(model: string): Promise<Product | undefined> {
    const updateProduct = await this.productRepository
      .createQueryBuilder('product')
      .where('product.model=:model && product.status=:status', {
        model,
        status: ProductStatuses.Reserved,
      })
      .getOne();
    return updateProduct;
  }

  async changeProductStatus(product: Product, status: string) {
    product.status = status;
    this.productRepository.save(product);
  }

  async getProductNotExistInUserBsket(
    model: string,
    id: number,
  ): Promise<Product | undefined> {
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
  }

  async searchProduct(searchItem: string): Promise<Product[] | undefined> {
    const updateProduct = await this.productRepository
      .createQueryBuilder('product')
      .where(
        'product.model LIKE :searchItem OR product.priceForUser LIKE :searchItem  or product.features  LIKE :searchItem ',
        {
          searchItem: `%${searchItem}%`,
        },
      )
      .getMany();
    return updateProduct;
  }
}
