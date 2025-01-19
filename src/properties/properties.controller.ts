import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PageOptionsDto } from 'src/dtos';
import { Roles } from 'src/decorators/roldes.decorator';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Role } from 'src/constants';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @Roles(Role.Admin)
  async getAllProperties(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
    const properties = await this.propertiesService.findAll(pageOptionsDto);
    res.status(HttpStatus.OK).json({
      data: properties,
    });
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getProperty(@Res() res, @Param('id') id: number) {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Property not found',
      });
    }
    res.status(HttpStatus.OK).json({
      data: property,
    });
  }

  @Post()
  @Roles(Role.Admin)
  async createProperty(
    @Res() res,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    const property = await this.propertiesService.create(createPropertyDto);
    res.status(HttpStatus.CREATED).json({
      data: property,
    });
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateProperty(
    @Res() res,
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const updatedProperty =
      await this.propertiesService.updatePropertyTitleAndProperties(
        updatePropertyDto,
        id,
      );
    res.status(HttpStatus.OK).json({
      data: updatedProperty,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deletePropertyTitle(@Res() res, @Param('id') id: number) {
    const deletedProperty = await this.propertiesService.remove(id);
    if (!deletedProperty) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Property not found',
      });
    }
    res.status(HttpStatus.OK).json({ message: 'deleted successfully' });
  }

  @Delete('property/:id')
  @Roles(Role.Admin)
  async deleteProperty(@Res() res, @Param('id') id: string) {
    const deletedProperty = await this.propertiesService.removeProperty(id);
    if (!deletedProperty) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Property not found',
      });
    }
    res.status(HttpStatus.OK).json({ message: 'deleted successfully' });
  }
}
