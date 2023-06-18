import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Properties } from 'src/typeorm/entities/Properties';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';
import { Repository } from 'typeorm';

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

  async createProductType(type: {
    type: string;
    title: string;
  }): Promise<ProductTypes | undefined> {
    let result;
    const searchProductType = await this.findProductTypeByType(type.type);
    if (!searchProductType) {
      const productType = this.productTypesRepository.create(type);
      result = await this.productTypesRepository.save(productType);
    } else {
      searchProductType.type = type.type;
      result = await this.productTypesRepository.save(searchProductType);
    }
    return result;
  }

  async getProductTypes(): Promise<ProductTypes[] | undefined> {
    return this.productTypesRepository.find();
  }

  addBrands(body: { brand: string; title: string }) {
    const brand = this.brandsRepository.create(body);
    return this.brandsRepository.save(brand);
  }

  getBrands(): Promise<Brands[] | undefined> {
    return this.brandsRepository.find();
  }

  async createCat(item): Promise<Category | undefined> {
    const cat = this.catergoryRepository.create({
      title: item.type,
      brands: item.brands,
      productTypes: item.types,
    });
    return this.catergoryRepository.save(cat);
  }

  async findProductTypeByType(type: string) {
    return this.productTypesRepository.findOneBy({ type });
  }

  getCats(): Promise<Category[] | undefined> {
    return this.catergoryRepository.find({});
  }

  getCat(
    id: number,
    brand: string,
    productType: string,
  ): Promise<Category | undefined> {
    return this.catergoryRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        brands: brand === 'true' ? true : false,
        productTypes: productType === 'true' ? true : false,
      },
    });
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
}
