import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/typeorm/entities/Category';
import { CreateCatDto } from './dtos/createCat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { Brands } from 'src/typeorm/entities/Brands';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private catergoryRepository: Repository<Category>,

    @InjectRepository(Brands)
    private brandRepository: Repository<Brands>,

    @InjectRepository(ProductTypes)
    private productTypeRepository: Repository<ProductTypes>,

    @InjectRepository(PropertyTitles)
    private propertyTitleRepository: Repository<PropertyTitles>,
  ) {}
  async createCat(
    createCatDetail: CreateCatDto,
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

    const brands = await this.brandRepository.findBy({
      id: In(createCatDetail.brands.map(Number)), // تبدیل آرایه به اعداد
    });

    const productTypes = await this.productTypeRepository.findBy({
      id: In(createCatDetail.types.map(Number)),
    });
    const propertyTitles = await this.propertyTitleRepository.findBy({
      id: In(createCatDetail.properties.map(Number)),
    });

    console.log(createCatDetail.photo);
    const cat = this.catergoryRepository.create({
      photo: createCatDetail.photo,
      title: createCatDetail.type.trim(),
      brands,
      productTypes,
      propertyTitles,
    });
    return this.catergoryRepository.save(cat);
  }

  async EditCategory(
    id: number,
    createCatDetail: CreateCatDto,
  ): Promise<Category | undefined> {
    const category = await this.catergoryRepository.findOneBy({
      title: createCatDetail?.type.trim(),
    });

    const brands = await this.brandRepository.findBy({
      id: In(createCatDetail.brands.map(Number)), // تبدیل آرایه به اعداد
    });

    const productTypes = await this.productTypeRepository.findBy({
      id: In(createCatDetail.types.map(Number)),
    });
    const propertyTitles = await this.propertyTitleRepository.findBy({
      id: In(createCatDetail.properties.map(Number)),
    });
    category.photo = createCatDetail.photo;
    category.title = createCatDetail.type.trim();
    category.brands = brands;
    category.productTypes = productTypes;
    category.propertyTitles = propertyTitles;
    return this.catergoryRepository.save(category);
  }

  async getCats(pageOptionsDto: PageOptionsDto): Promise<PageDto<Category>> {
    const { page, take } = pageOptionsDto;
    const query = await this.catergoryRepository.findAndCount({
      skip: (page - 1) * take,
      take,
      relations: [
        'brands',
        'productTypes',
        'propertyTitles',
        'propertyTitles.properties',
      ],
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: query[1],
      pageOptionsDto,
    });
    return new PageDto(query[0], pageMetaDto);
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

  async removeCategory(id: string): Promise<any> {
    await this.catergoryRepository.delete(id);
    return 'successfulty';
  }
}
