import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PropertyDetail {
  @IsString({ message: 'شناسه ویژگی باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'شناسه ویژگی نمی‌تواند خالی باشد.' })
  id: string;

  @IsString({ message: 'مقدار ویژگی باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'مقدار ویژگی نمی‌تواند خالی باشد.' })
  value: string;
}



export class CreateProductDto {
  @IsString({ message: 'مدل باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'مدل نمی‌تواند خالی باشد.' })
  model: string;

  photo: string;

  @IsString({ message: 'شناسه دسته‌بندی باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'شناسه دسته‌بندی نمی‌تواند خالی باشد.' })
  category: string;

  @IsString({ message: 'شناسه برند باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'شناسه برند نمی‌تواند خالی باشد.' })
  brand: string;

  @IsString({ message: 'شناسه نوع محصول باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'شناسه نوع محصول نمی‌تواند خالی باشد.' })
  types: string;

  @IsString({ message: 'قیمت برای کاربر باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'قیمت برای کاربر نمی‌تواند خالی باشد.' })
  priceForUser: string;

  @IsString({ message: 'قیمت برای همکار باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'قیمت برای همکار نمی‌تواند خالی باشد.' })
  priceForWorkmate: string;

  @IsString({ message: 'گارانتی باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'گارانتی نمی‌تواند خالی باشد.' })
  warranty: string;

  @IsString({ message: 'تعداد موجودی باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'تعداد موجودی نمی‌تواند خالی باشد.' })
  numberOfExist: string;

  @IsString({ message: 'تخفیف باید از نوع رشته باشد.' })
  @IsNotEmpty({ message: 'تخفیف نمی‌تواند خالی باشد.' })
  off: string;

  @IsArray({ message: 'ویژگی‌ها باید آرایه باشند.' })
  @ValidateNested({ each: true, message: 'ساختار ویژگی‌ها نامعتبر است.' })
  @Type(() => PropertyDetail)
  properties: PropertyDetail[];
}
