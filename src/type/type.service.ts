import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Properties } from 'src/typeorm/entities/Properties';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';
import { Repository } from 'typeorm';
import {
  CreateBrandDetail,
  CreateTypeDetail,
  createCatDetail,
} from './utils/types';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(ProductTypes)
    private productTypesRepository: Repository<ProductTypes>,

    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,

    @InjectRepository(Category)
    private catergoryRepository: Repository<Category>,

    @InjectRepository(Properties)
    private properitesRepository: Repository<Properties>,

    @InjectRepository(PropertyTitles)
    private propertyTitlesRepository: Repository<PropertyTitles>,
  ) {}

  async createProductType(
    createTypeDetail: CreateTypeDetail,
  ): Promise<ProductTypes | undefined> {
    let result;
    const searchProductType = await this.findProductTypeByType(
      createTypeDetail.type,
    );
    if (!searchProductType) {
      const productType = this.productTypesRepository.create(createTypeDetail);
      result = await this.productTypesRepository.save(productType);
    } else {
      searchProductType.type = createTypeDetail.type;
      result = await this.productTypesRepository.save(searchProductType);
    }
    return result;
  }

  async getProductTypes(): Promise<ProductTypes[] | undefined> {
    return this.productTypesRepository.find();
  }

  async addBrands(createBrandDetail: CreateBrandDetail) {
    const findBrand = await this.brandsRepository.findOneBy({
      brand: createBrandDetail.brand,
    });

    const findTitle = await this.brandsRepository.findOneBy({
      title: createBrandDetail.title,
    });
    if (findTitle || findBrand) {
      throw new HttpException(
        'این برند قبلا وارد شده است',
        HttpStatus.BAD_REQUEST,
      );
    }
    const brand = this.brandsRepository.create({ ...createBrandDetail });
    return this.brandsRepository.save(brand);
  }

  getBrands(): Promise<Brands[] | undefined> {
    return this.brandsRepository.find();
  }

  async createCat(
    createCatDetail: createCatDetail,
  ): Promise<Category | undefined> {
    const findcat = await this.catergoryRepository.findOneBy({
      title: createCatDetail?.type.trim(),
    });
    if (findcat) {
      throw new HttpException(
        `دسته ${createCatDetail.type} قبلا وارد شده است`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const cat = this.catergoryRepository.create({
      title: createCatDetail.type,
      brands: createCatDetail.brands,
      productTypes: createCatDetail.types,
      propertyTitles: createCatDetail.properties,
    });
    return this.catergoryRepository.save(cat);
  }

  async findProductTypeByType(type: string) {
    return this.productTypesRepository.findOneBy({ type });
  }

  getCats(): Promise<Category[] | undefined> {
    return this.catergoryRepository.find({});
  }

  async getCat(id: number): Promise<Category | undefined> {
    let cats = await this.catergoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.brands', 'brands')
      .leftJoinAndSelect('category.productTypes', 'productTypes')
      .leftJoinAndSelect('category.propertyTitles', 'propertyTitles')
      .leftJoinAndSelect('propertyTitles.properties', 'properties')
      .where('category.id=:id', { id })
      .getOne();

    return cats;
  }

  async addProperty(items): Promise<PropertyTitles | undefined> {
    const check = await this.propertyTitlesRepository.findOneBy({
      title: items.title,
    });

    if (check) {
      throw new HttpException(
        'عنوان وارد شده قبلا استفاده شده است ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const properties = [];
    for (let key in items.properties) {
      properties.push(
        this.properitesRepository.create({
          property: items.properties[key],
          title: items.title,
        }),
      );
    }
    const resultProperties = await this.properitesRepository.save(properties);
    const PropertyTitles = this.propertyTitlesRepository.create({
      title: items.title,
      properties: resultProperties,
    });

    return this.propertyTitlesRepository.save(PropertyTitles);
  }

  async getProperties(): Promise<PropertyTitles[] | undefined> {
    return this.propertyTitlesRepository.find();
  }
}
