import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SurveyRatingCreateDto {
  @ApiProperty({
    example: 'Чисто, но нет бумаги',
    description: 'Комментарий пользователя',
    required: true,
  })
  @IsString()
  comment: string;
}

export class SurveyRatingResDto extends SurveyRatingCreateDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор',
  })
  id: number;

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
