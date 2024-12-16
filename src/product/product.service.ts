import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import {
  CreateProductDetial,
  EditProduct,
  GetProductsDetail,
} from './utils/types';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { ProductStatuses } from 'src/constants';
import { isEmptyArray } from 'src/common/utils/functions.utils';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto, PageOptionsDto } from 'src/dtos';
import { groupBy } from 'lodash';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryPhotoRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Product)
    private brandRepository: Repository<Brands>,
    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,
    private usersService: UsersService,
  ) {}

  async createProduct(
    detailCreateProduct: CreateProductDetial,
    numberOfExist: number,
    username: string,
  ): Promise<Product[] | undefined> {
    const findProduct = await this.productRepository.findOneBy({
      model: detailCreateProduct.model.trim(),
    });
    if (findProduct) {
      throw new HttpException(
        `مدل ${detailCreateProduct.model} قبلا وارد شده است `,
        HttpStatus.BAD_REQUEST,
      );
    }

    const products: Product[] = [];
    const brand = detailCreateProduct.brand;
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
          deliveryMethod: detailCreateProduct.deliveryMethod,
          warranty: detailCreateProduct.warranty,
          model: detailCreateProduct.model,
          priceForUser: detailCreateProduct.priceForUser,
          priceForWorkmate: detailCreateProduct.priceForWorkmate,
          // off: detailCreateProduct.off,
          brand: { id: brand?.id },
          author: user,
          photos: productPhoto,
          productTypes: detailCreateProduct.types,
          category: { id: detailCreateProduct.category },
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

    const itemCount = (await queryBuilder.getRawMany())[0]?.ctn;
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getProductsForPublic(
    filter: GetProductsDetail,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    const { catId, properties, brand, type } = filter;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select('product.model', 'model')
      .addSelect('MAX(product.priceForUser)', 'priceForUser')
      .addSelect('MAX(product.warranty)', 'warranty')
      .addSelect('MAX(product.deliveryMethod)', 'deliveryMethod')
      .addSelect('MAX(product.off)', 'off')
      .addSelect('COUNT(product.id)', 'productCount')
      .leftJoinAndSelect('product.photos', 'photos');

    // Ensure properties is an array
    const propertyFilter = Array.isArray(properties)
      ? properties
      : properties
      ? [properties]
      : [];

    if (propertyFilter.length > 0) {
      queryBuilder
        .leftJoinAndSelect('product.properties', 'properties')
        .andWhere('properties.id IN(:...ids)', { ids: propertyFilter });
    }

    if (brand) {
      queryBuilder
        .leftJoinAndSelect('product.brand', 'brand')
        .andWhere('brand.id = :id', { id: Number(brand) });
    }

    if (type) {
      queryBuilder
        .leftJoinAndSelect('product.productTypes', 'productTypes')
        .andWhere('productTypes.id = :id', { id: Number(type) });
    }

    if (catId) {
      queryBuilder
        .leftJoinAndSelect('product.category', 'category')
        .andWhere('category.id = :catId', { catId });
    }

    // Grouping, ordering, and pagination
    queryBuilder
      .orderBy('product.created_at', pageOptionsDto.order || 'DESC')
      .groupBy('product.model')
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    // Fetch raw count and entities
    const result = await queryBuilder.getRawAndEntities();

    // Access raw data and entities separately
    const rawResults = result.raw;

    // Extract itemCount from raw results
    const itemCount = rawResults.length > 0 ? rawResults[0].ctn : 0;

    // Prepare pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(result.raw, pageMetaDto);
  }

  async getProductForPublic(model: string): Promise<Product | undefined> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photos', 'photos')
      .leftJoinAndSelect('product.properties', 'properties')
      .groupBy('product.model')
      .where('product.model = :model', { model: model.trim() })
      .getOne();
    return product;
  }

  getProduct(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
        productTypes: true,
        category: true,
        properties: true,
        photos: true,
      },
    });
  }

  deleteProduct(model: string) {
    this.productRepository
      .createQueryBuilder('product')
      .delete()
      .from(Product)
      .where('model = :model', { model })
      .execute();
  }

  async editProduct(
    model: string,
    detailEditProduct: EditProduct,
  ): Promise<Product | undefined> {
    const productPhoto: ProductPhoto[] = [];
    const product = await this.productRepository.find({
      relations: {
        productTypes: true,
      },
      where: { model },
    });
    const photo = await this.productPhotoRepository.findOneBy({
      src: detailEditProduct.photo,
    });
    productPhoto.push(photo);
    const updateProduct = product.map((item) => {
      return {
        ...item,
        productTypes: detailEditProduct.types,
        brand: detailEditProduct.brand,
        deliveryMethod: detailEditProduct.deliveryMethod,
        warranty: detailEditProduct.warranty,
        model: detailEditProduct.model,
        priceForUser: detailEditProduct.priceForUser,
        priceForWorkmate: detailEditProduct.priceForWorkmate,
        off: detailEditProduct.off,
        category: detailEditProduct.category,
        properties: detailEditProduct.properties,
        photos: productPhoto,
        // author: user,
        // photos: productPhoto,
      };
    });
    return this.productRepository.save(updateProduct)[0];
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
      .leftJoinAndSelect('product.photos', 'photos')
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

  async searchProduct(searchItem: string): Promise<any> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.model', // Group by model
        'product.priceForUser', // Include specific columns
        'category.title', // Include related category field
        'COUNT(product.id) AS productCount', // Example aggregate
      ])
      .where(
        'product.model LIKE :searchItem OR product.priceForUser LIKE :searchItem',
        { searchItem: `%${searchItem}%` },
      )
      .leftJoin('product.category', 'category')
      .groupBy('product.model')
      .addGroupBy('category.title')
      .addGroupBy('category.id')
      .getRawMany();

    const brands = await this.brandRepository.query(
      'SELECT title, brand FROM brands WHERE title LIKE ? OR brand LIKE ?',
      [`%${searchItem}%`, `%${searchItem}%`],
    );

    const category = await this.categoryPhotoRepository.query(
      'SELECT id, title FROM category WHERE title LIKE ?',
      [`%${searchItem}%`],
    );

    const result = {
      products,
      brands,
      category,
    };

    return result;
  }

  async getProductNotReserved(
    ids: Array<number>,
    model: string,
  ): Promise<Product | undefined> {
    const queryBuilder = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photos', 'photos')
      .where('orderId is null and model=:model', { model });
    if (ids && !isEmptyArray(ids)) {
      queryBuilder.andWhere(' product.id NOT IN(:...ids) ', {
        ids,
      });
    }
    return queryBuilder.getOne();
  }

  async getProductsWithIds(
    ids: Array<number>,
  ): Promise<Product[] | undefined | null> {
    if (!isEmptyArray(ids)) {
      return this.productRepository
        .createQueryBuilder('product')
        .where(' product.id  IN(:...ids) ', { ids })
        .getMany();
    } else return [];
  }
}
