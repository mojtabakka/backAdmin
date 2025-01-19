import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';
import { Properties } from 'src/typeorm/entities/Properties';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private readonly propertyRepository: Repository<Properties>,

    @InjectRepository(PropertyTitles)
    private propertyTitlesRepository: Repository<PropertyTitles>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Property>> {
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

  async findOne(id: number): Promise<Property | null> {
    return this.propertyTitlesRepository.findOne({
      where: { id },
      relations: ['properties'],
    });
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property | null> {
    await this.propertyRepository.update(id, updatePropertyDto);
    return this.propertyRepository.findOne({ where: { id } });
  }

  async updatePropertyTitleAndProperties(
    formData: UpdatePropertyDto,
    id: number,
  ) {
    // پیدا کردن PropertyTitle با روابط
    const propertyTitle = await this.propertyTitlesRepository.findOne({
      where: { id },
      relations: ['properties'], // اطمینان از لود روابط
    });

    if (!propertyTitle) {
      throw new Error(`PropertyTitle with id ${id} not found.`);
    }

    // نگاشت پراپرتی‌های موجود
    const existingPropertiesMap = new Map(
      propertyTitle.properties.map((property) => [property.id, property]),
    );

    // مدیریت آپدیت و ایجاد پراپرتی‌ها
    const updatedProperties = [];
    for (const newPropertyData of formData.properties) {
      const existingProperty = existingPropertiesMap.get(
        Number(newPropertyData.id),
      );

      if (existingProperty) {
        // آپدیت پراپرتی موجود
        existingProperty.property = newPropertyData.property;
        updatedProperties.push(existingProperty);
      } else {
        // ایجاد پراپرتی جدید و اتصال به PropertyTitle
        const newProperty = this.propertyRepository.create({
          property: newPropertyData.property,
          propertyTitle, // اتصال به PropertyTitle
        });

        const savedProperty = await this.propertyRepository.save(newProperty); // ذخیره در دیتابیس
        updatedProperties.push(savedProperty);
      }
    }

    // حذف پراپرتی‌هایی که در فرم نیستند
    // const idsInForm = new Set(formData.properties.map((p) => p.id));
    // const propertiesToRemove = propertyTitle.properties.filter(
    //   (property) => !idsInForm.has(property.id.toString()),
    // );

    // if (propertiesToRemove.length > 0) {
    //   await this.propertyRepository.remove(propertiesToRemove);
    // }

    // // ذخیره پراپرتی‌های آپدیت‌شده و جدید
    // await this.propertyRepository.save(updatedProperties);

    // // آپدیت عنوان PropertyTitle
    // propertyTitle.title = formData.title;
    // await this.propertyTitlesRepository.save(propertyTitle);
  }

  async remove(id: number): Promise<any> {
    const result = await this.propertyTitlesRepository.delete(id);
    return 'successfulty';
  }

  async removeProperty(id: string): Promise<any> {
    await this.propertyRepository.delete(id);
    return 'successfulty';
  }

  async create(items): Promise<PropertyTitles | undefined> {
    const check = await this.propertyRepository.findOneBy({
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
        this.propertyRepository.create({
          property: items.properties[key],
          title: items.title,
        }),
      );
    }
    const resultProperties = await this.propertyRepository.save(properties);
    const PropertyTitles = this.propertyTitlesRepository.create({
      title: items.title,
      properties: resultProperties,
    });

    return this.propertyTitlesRepository.save(PropertyTitles);
  }
}
