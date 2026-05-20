import { ApiProperty } from '@nestjs/swagger';
import {
  SurveyEntity,
  SurveyRatingEntity,
} from 'src/module/survey/entity/survey.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'lecture_hall' })
export class LectureHallEntity extends SurveyEntity {
  @ApiProperty({
    type: () => [LectureHallRatingEntity],
    description: 'Список оценок лекционных залов',
  })
  @OneToMany(() => LectureHallRatingEntity, (rating) => rating.lectureHall, {
    cascade: true,
  })
  ratings: LectureHallRatingEntity[];
}

@Entity({ name: 'lecture_hall_ratings' })
export class LectureHallRatingEntity extends SurveyRatingEntity {
  @ApiProperty({
    description: 'Чистота в зале',
    minimum: 1,
    maximum: 5,
    example: 5,
    title: 'Cleanliness score',
  })
  @Column({ type: 'int', name: 'cleanliness_score' })
  cleanliness: number;

  @ApiProperty({
    description: 'Комфортность',
    minimum: 1,
    maximum: 5,
    example: 4,
    title: 'Comfort score',
  })
  @Column({ type: 'int', name: 'comfort_score' })
  comfort: number;

  @ApiProperty({
    description: 'Оснащённость орг. техникой',
    minimum: 1,
    maximum: 5,
    example: 3,
    title: 'Equipment score',
  })
  @Column({ type: 'int', name: 'equipment_score' })
  equipment: number;

  @ManyToOne(() => LectureHallEntity, (lectureHall) => lectureHall.ratings, {
    onDelete: 'CASCADE',
  })
  lectureHall: LectureHallEntity;
}
