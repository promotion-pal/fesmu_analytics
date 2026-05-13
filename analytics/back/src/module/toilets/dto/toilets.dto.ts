import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ToiletCreateRatingDto } from './toilets-rating.dto';

export class ToiletCreateDto {
  @ApiProperty({
    example: 'Туалет в ТЦ "Европа"',
    description: 'Название или местоположение туалета',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [ToiletCreateRatingDto],
    description: 'Список оценок туалета',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToiletCreateRatingDto)
  ratings: ToiletCreateRatingDto[];
}

export class ToiletResDto extends ToiletCreateDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор туалета',
  })
  id: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания записи',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T12:45:00Z',
    description: 'Дата последнего обновления',
  })
  updatedAt: Date;
}
