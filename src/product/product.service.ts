import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Repository } from 'typeorm';
import { CreateProduct } from './utils/createProduct';
import { UsersService } from 'src/users/users.service';
import { EditProduct } from './utils/types';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { ProductStatuses } from 'src/constants';
import {
  getWordsonPersiankyboard,
  isEmptyArray,
} from 'src/common/utils/functions.utils';
import { PageDto } from 'src/dtos/page.dto';
import { User } from 'src/typeorm/entities/User';
import { PageMetaDto, PageOptionsDto } from 'src/dtos';
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
          author: user,
          photos: productPhoto,
          brands: detailCreateProduct.brands,
          productTypes: detailCreateProduct.types,
          categories: [{ id: detailCreateProduct.categories }],
          properties: detailCreateProduct.properties,
        }),
      );
    }
    const product = await this.productRepository.save(products);
    return { ...product };
  }

  uploadProductImage(src: string) {
    if (!src) {
      throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
    }
    const photoUrl = this.productPhotoRepository.create({ src });
    return this.productPhotoRepository.save(photoUrl);
  }

  async getProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    const queryBuilder = await this.productRepository
      .createQueryBuilder('product')
      .groupBy('product.model')
      .addSelect(' COUNT(*) OVER() ', 'ctn')
      .orderBy('product.created_at', pageOptionsDto.order)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);
    console.log(await queryBuilder.getRawMany());

    const itemCount = (await queryBuilder.getRawMany())[0].ctn;
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getProductsForPublic(items): Promise<Product[] | undefined> {
    const properties = items.properties;
    let products = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photos', 'photos');
    if (properties) {
      const filter = !isEmptyArray(properties) ? properties : [properties];

      products = products
        .leftJoinAndSelect('product.properties', 'properties')
        .where('properties.id IN(:...ids) ', { ids: filter });
    }
    products = products
      .groupBy('product.model')
      .select('*')

      .addSelect(['COUNT(product.id) as numberOfExist']);

    return products.getRawMany();
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
        properties: true,
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
    const properties = detailEditProduct.properties;
    delete detailEditProduct.types;
    delete detailEditProduct.brands;
    delete detailEditProduct.categories;
    delete detailEditProduct.properties;
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
    product.properties = properties;
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
      .where('product.model=:model', {
        model,
        id,
      })
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
        'product.model LIKE :searchItem OR product.priceForUser LIKE :searchItem ',
        {
          searchItem: `%${searchItem}%`,
        },
      )
      .groupBy('product.model')
      .getMany();
    return updateProduct;
  }
}
