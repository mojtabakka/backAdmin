import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Properties } from 'src/typeorm/entities/Properties';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';
import { Repository } from 'typeorm';
import { CreateBrandDetail, CreateTypeDetail } from './utils/types';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { CreateTypeDto } from './dtos/createType.dto';

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

  async editBrand(brandId: number, createBrandDetail: CreateBrandDetail) {
    const brand = await this.brandsRepository.findOneBy({ id: brandId });
    brand.title = createBrandDetail.title;
    brand.brand = createBrandDetail.brand;

    return this.brandsRepository.save(brand);
  }

  async editProdcutType(brandId: number, createBrandDetail: CreateTypeDto) {
    const brand = await this.productTypesRepository.findOneBy({ id: brandId });
    brand.title = createBrandDetail.title;
    brand.type = createBrandDetail.type;

    return this.productTypesRepository.save(brand);
  }

  async getBrands(pageOptionsDto: PageOptionsDto): Promise<PageDto<Brands>> {
    const { page, take } = pageOptionsDto;
    const query = await this.brandsRepository.findAndCount({
      skip: (page - 1) * take,
      take,
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: query[1],
      pageOptionsDto,
    });
    return new PageDto(query[0], pageMetaDto);
  }

  async getProductTypes(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductTypes>> {
    const { page, take } = pageOptionsDto;
    const query = await this.productTypesRepository.findAndCount({
      skip: (page - 1) * take,
      take,
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: query[1],
      pageOptionsDto,
    });
    return new PageDto(query[0], pageMetaDto);
  }

  async getProperties(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PropertyTitles>> {
    const { page, take } = pageOptionsDto;
    const query = await this.propertyTitlesRepository.findAndCount({
      skip: (page - 1) * take,
      take,
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: query[1],
      pageOptionsDto,
    });
    return new PageDto(query[0], pageMetaDto);
  }

  async getBrand(id: number): Promise<Brands> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
    });
    if (!brand) {
      throw new Error('برند موردنظر پیدا نشد');
    }
    return brand;
  }

  async getProdcutType(id: number): Promise<ProductTypes> {
    const productType = await this.productTypesRepository.findOne({
      where: { id },
    });
    if (!productType) {
      throw new Error('برند موردنظر پیدا نشد');
    }
    return productType;
  }

  async deleteBrand(id: number): Promise<any> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
    });
    if (!brand) {
      throw new Error('برند موردنظر پیدا نشد');
    }
    await this.brandsRepository.remove(brand);
  }

  async DeleteProdcutType(id: number): Promise<any> {
    const ProdcutType = await this.productTypesRepository.findOne({
      where: { id },
    });
    if (!ProdcutType) {
      throw new Error('برند موردنظر پیدا نشد');
    }
    await this.productTypesRepository.remove(ProdcutType);
  }

  async findProductTypeByType(type: string) {
    return this.productTypesRepository.findOneBy({ type });
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
