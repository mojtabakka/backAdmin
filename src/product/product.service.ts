import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import {
  CreateProductDetail,
  EditProduct,
  GetProductsDetail,
} from './utils/types';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { ProductStatuses } from 'src/constants';
import { isEmptyArray } from 'src/common/utils/functions.utils';
import { PageDto } from 'src/dtos/page.dto';
import { PageMetaDto, PageOptionsDto } from 'src/dtos';
import { groupBy } from 'lodash';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Properties } from 'src/typeorm/entities/Properties';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryPhotoRepository: Repository<Category>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Brands)
    private brandRepository: Repository<Brands>,

    @InjectRepository(ProductTypes)
    private productTypesRepository: Repository<ProductTypes>,

    @InjectRepository(ProductPhoto)
    private productPhotoRepository: Repository<ProductPhoto>,

    @InjectRepository(Properties)
    private propertyPhotoRepository: Repository<Properties>,

    private usersService: UsersService,
  ) {}

  createProduct = async (data: CreateProductDetail, username: string) => {
    const user = await this.usersService.findOne(username);

    const brand = await this.brandRepository.findOneOrFail({
      where: { id: parseInt(data.brand) },
    });
    const category = await this.categoryPhotoRepository.findOneOrFail({
      where: { id: parseInt(data.category) },
    });

    const productType = await this.productTypesRepository.findOneOrFail({
      where: { id: parseInt(data.types) },
    });

    const productPhoto = await this.productPhotoRepository.findOneOrFail({
      where: { id: parseInt(data.photo) },
    });

    const properties = await Promise.all(
      data.properties.map(async (prop) => {
        const property = await this.propertyPhotoRepository.findOneOrFail({
          where: { id: parseInt(prop.value) },
        });
        return property;
      }),
    );

    const products = [];
    const numberOfExist = parseInt(data.numberOfExist);

    for (let i = 0; i < numberOfExist; i++) {
      const newProduct = this.productRepository.create({
        model: data.model.toString(),
        priceForUser: data.priceForUser,
        priceForWorkmate: data.priceForWorkmate,
        warranty: data.warranty,
        off: parseFloat(data.off),
        brand,
        category,
        productTypes: [productType],
        properties,
        author: user,
        photos: [productPhoto],
      });
      products.push(newProduct);
    }
    return await this.productRepository.save(products);
  };

  uploadProductImage(src: string) {
    if (!src) {
      throw new HttpException('There is no file', HttpStatus.BAD_REQUEST);
    }
    const photoUrl = this.productPhotoRepository.create({ src });
    return this.productPhotoRepository.save(photoUrl);
  }

  async getProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    console.log('hello');
    const { page, take } = pageOptionsDto;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .select('product.model', 'model')
      .addSelect('COUNT(*)', 'count')
      .addSelect('product.id', 'id')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MIN(p.id)')
          .from(Product, 'p')
          .where('p.model = product.model')
          .getQuery();
        return `product.id = ${subQuery}`;
      })
      .groupBy('product.model')
      .orderBy('product.model', 'ASC')
      .offset((page - 1) * take)
      .limit(take);

    // دریافت تعداد کل نتایج
    const itemCount = (await queryBuilder.getRawMany())[0]?.ctn;

    // دریافت داده‌ها و نهادهای واقعی (products)
    const { entities } = await queryBuilder.getRawAndEntities();

    // ایجاد متا دیتا برای صفحه‌بندی
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // بازگشت به عنوان PageDto
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
      .where('orderId is null')
      .leftJoinAndSelect('product.photos', 'photos');
    const decodedproperties = decodeURIComponent(properties);
    const cleanedproperties = decodedproperties
      .replace(/,+/g, ',')
      .split(',')
      .map((item) => Number(item));
    const propertyFilter = Array.isArray(cleanedproperties)
      ? cleanedproperties
      : cleanedproperties
      ? [cleanedproperties]
      : [];
    if (propertyFilter.length === 1 && propertyFilter[0] === 0)
      propertyFilter.pop();

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
    const queryBuilderMain = queryBuilder
      .orderBy('product.created_at', pageOptionsDto.order || 'DESC')
      .groupBy('product.model')
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    // Fetch raw count and entities
    const result = await queryBuilderMain.getRawAndEntities();

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
      .where('product.model = :model', { model: model.trim() }) // جستجو بر اساس model
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

  getProductByModel(model: string): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { model },
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

  async AvailableProducts(model: string) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.orderId IS NULL')
      .andWhere('product.model = :model', { model })
      .getCount();
    return products;
  }

  editProduct = async (
    model: string,
    data: CreateProductDetail,
    username: string,
  ) => {
    const user = await this.usersService.findOne(username);
    const brand = await this.brandRepository.findOneOrFail({
      where: { id: parseInt(data.brand) },
    });
    const category = await this.categoryPhotoRepository.findOneOrFail({
      where: { id: parseInt(data.category) },
    });

    const productType = await this.productTypesRepository.findOneOrFail({
      where: { id: parseInt(data.types) },
    });

    const properties = await Promise.all(
      data.properties.map(async (prop) => {
        const property = await this.propertyPhotoRepository.findOneOrFail({
          where: { id: parseInt(prop.value) },
        });
        return property;
      }),
    );

    const productToEdit = await this.productRepository.findOneOrFail({
      where: { model },
      relations: ['properties', 'brand', 'category', 'productTypes', 'author'], // اضافه کردن روابط لازم برای ویرایش
    });

    // بروزرسانی محصول
    productToEdit.model = data.model.toString();
    productToEdit.priceForUser = data.priceForUser;
    productToEdit.priceForWorkmate = data.priceForWorkmate;
    productToEdit.warranty = data.warranty;
    productToEdit.off = parseFloat(data.off);
    productToEdit.brand = brand;
    productToEdit.category = category;
    productToEdit.productTypes = [productType];
    productToEdit.properties = properties;
    productToEdit.author = user;

    // ذخیره تغییرات محصول
    await this.productRepository.save(productToEdit);

    const availableProucts = await this.AvailableProducts(model);
    const minesProucts = +data.numberOfExist - +availableProucts;

    // اگر تعداد موجودی کاهش پیدا کرده باشد، محصولات جدید ایجاد می‌کنیم
    if (minesProucts > 0) {
      const products = [];
      for (let i = 0; i < minesProucts; i++) {
        const newProduct = this.productRepository.create({
          model: data.model.toString(),
          priceForUser: data.priceForUser,
          priceForWorkmate: data.priceForWorkmate,
          warranty: data.warranty,
          off: parseFloat(data.off),
          brand,
          category,
          productTypes: [productType],
          properties,
          author: user,
        });
        products.push(newProduct); // اضافه کردن محصول جدید به آرایهs
      }
      await this.productRepository.save(products); // ذخیره محصولات جدید
    } else {
      // اگر تعداد موجودی افزایش پیدا کرده باشد، محصولات قدیمی که نیاز به حذف دارند را پیدا می‌کنیم
      const products = await this.productRepository
        .createQueryBuilder('product')
        .where('product.orderid IS NULL')
        .andWhere('product.model = :model', { model })
        .getMany();

      if (products.length > 0) {
        const ids = products
          .slice(0, minesProucts * -1 + 1)
          .map((item) => item.id);
        ids.length;
        await this.productRepository
          .createQueryBuilder()
          .delete()
          .from(Product)
          .where('id IN (:...ids)', { ids }) // استفاده از `IN` برای حذف چندین محصول
          .execute();

        // حذف محصولات
        await this.productRepository.delete(33);
      }
    }

    // بازگشت محصول ویرایش شده
    return await this.productRepository.save(productToEdit);
  };

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
