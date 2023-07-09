import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/typeorm/entities/Category';
import { CreateCatDto } from './dtos/createCat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private catergoryRepository: Repository<Category>,
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
    const cat = this.catergoryRepository.create({
      title: createCatDetail.type,
      brands: createCatDetail.brands,
      productTypes: createCatDetail.types,
      propertyTitles: createCatDetail.properties,
    });
    return this.catergoryRepository.save(cat);
  }
  getCats(): Promise<Category[] | undefined> {
    return this.catergoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.brands', 'brands')
      .leftJoinAndSelect('category.propertyTitles', 'propertyTitles')
      .leftJoinAndSelect('category.productTypes', 'productTypes')
      .leftJoinAndSelect('propertyTitles.properties', 'properties')
      .getMany();
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
}
