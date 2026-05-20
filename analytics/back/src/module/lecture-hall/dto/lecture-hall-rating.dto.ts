import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import {
  SurveyRatingCreateDto,
  SurveyRatingResDto,
} from 'src/module/survey/dto/survey-rating.dto';

export class LectureHallRatingCreateDto extends SurveyRatingCreateDto {
  @ApiProperty({
    description: 'Чистота в зале',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  cleanliness: number;
  @ApiProperty({
    description: 'Комфортность',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  comfort: number;
  @ApiProperty({
    description: 'Оснащённость орг. техникой',
    minimum: 1,
    maximum: 5,
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  equipment: number;
}

export class LectureHallRatingResDto extends IntersectionType(
  LectureHallRatingCreateDto,
  SurveyRatingResDto,
) {}
