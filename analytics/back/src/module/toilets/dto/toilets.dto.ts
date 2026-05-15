import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TOILET_LOCATION, TOILET_PERSON } from '../enum/toilets.enum';
import {
  ToiletCreateRatingDto,
  ToiletRatingResDto,
} from './toilets-rating.dto';

export class ToiletCreateDto {
  @ApiProperty({
    example: 'Туалет в ТЦ "Европа"',
    description: 'Название или местоположение туалета',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    enum: TOILET_LOCATION,
    example: TOILET_LOCATION.FIRST_BUILDING,
    description: 'Местоположение туалета',
    required: true,
  })
  location: TOILET_LOCATION;

  @ApiProperty({
    enum: TOILET_PERSON,
    example: TOILET_PERSON.MAN,
    description: 'Гендер',
    required: true,
  })
  person: TOILET_PERSON;

  @ApiProperty({
    example: 1,
    required: true,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  floor: number;
}

export class ToiletResDto extends ToiletCreateDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор туалета',
  })
  id: number;

  @ApiProperty({
    type: [ToiletCreateRatingDto],
    description: 'Список оценок туалета',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToiletRatingResDto)
  ratings: ToiletRatingResDto[];

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания записи',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T12:45:00Z',
    description: 'Дата последнего обновления',
  })
  @Type(() => Date)
  updatedAt: Date;
}
