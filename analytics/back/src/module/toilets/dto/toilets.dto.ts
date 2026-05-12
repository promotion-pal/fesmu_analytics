import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateToiletRatingDto } from './toilets-rating.dto';

export class CreateToiletDto {
  @ApiProperty({
    example: 'Туалет в ТЦ "Европа"',
    description: 'Название или местоположение туалета',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [CreateToiletRatingDto],
    description: 'Список оценок туалета',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateToiletRatingDto)
  ratings: CreateToiletRatingDto[];
}
