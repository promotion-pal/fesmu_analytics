import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  SurveyCreateDto,
  SurveyResDto,
} from 'src/module/survey/dto/survey.dto';
import { LectureHallRatingEntity } from '../entity/lecture-hall.entity';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LectureHallRatingResDto } from './lecture-hall-rating.dto';

export class LectureHallCreateDto extends SurveyCreateDto {}

export class LectureHallResDto extends IntersectionType(
  LectureHallCreateDto,
  SurveyResDto,
) {
  @ApiProperty({
    type: [LectureHallRatingEntity],
    description: 'Список оценок',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LectureHallRatingResDto)
  ratings: LectureHallRatingResDto[];
}
