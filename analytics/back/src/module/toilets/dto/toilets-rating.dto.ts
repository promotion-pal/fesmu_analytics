import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class ToiletCreateRatingDto {
  @ApiProperty({
    example: 4,
    description: 'Оценка запаха от 1 до 5',
    minimum: 1,
    maximum: 5,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  smellRating: number;

  @ApiProperty({
    example: 5,
    description: 'Оценка чистоты от 1 до 5',
    minimum: 1,
    maximum: 5,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  purityRating: number;

  @ApiProperty({
    example: true,
    description: 'Наличие туалетной бумаги',
    default: false,
    required: true,
  })
  @IsBoolean()
  hasToiletPaper: boolean;

  @ApiProperty({
    example: false,
    description: 'Наличие мыла',
    default: false,
    required: true,
  })
  @IsBoolean()
  hasSoap: boolean;

  @ApiProperty({
    example: 'Чисто, но нет бумаги',
    description: 'Комментарий пользователя',
    required: true,
  })
  @IsString()
  comment: string;
}

export class ToiletRatingResDto extends ToiletCreateRatingDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор оценки',
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
