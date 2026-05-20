import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SURVEY_LOCATION } from '../enum/survey.enum';

export class SurveyCreateDto {
  @ApiProperty({
    example: 'ТЦ "Европа"',
    description: 'Название или местоположение',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    enum: SURVEY_LOCATION,
    example: SURVEY_LOCATION.FIRST_BUILDING,
    description: 'Местоположение',
    required: true,
  })
  @IsEnum(SURVEY_LOCATION)
  location: SURVEY_LOCATION;
}

export class SurveyResDto extends SurveyCreateDto {
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
