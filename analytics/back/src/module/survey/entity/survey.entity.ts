import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SURVEY_LOCATION } from '../enum/survey.enum';

@Entity({ name: 'survey' })
export class SurveyEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор опроса' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Наименование',
    description: 'Название или местоположение',
    nullable: true,
  })
  @Column({
    length: 100,
    name: 'name',
    nullable: true,
    type: 'varchar',
  })
  name: string;

  @ApiProperty({
    example: SURVEY_LOCATION.FIRST_BUILDING,
    description: 'Местоположение',
    required: true,
  })
  @Column({
    type: 'enum',
    name: 'location',
    enum: SURVEY_LOCATION,
    nullable: false,
    default: SURVEY_LOCATION.FIRST_BUILDING,
  })
  location: SURVEY_LOCATION;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания записи',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T12:45:00Z',
    description: 'Дата последнего обновления',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}

@Entity({ name: 'survey_ratings' })
export class SurveyRatingEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор оценки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Комментарий пользователя ...',
    description: 'Комментарий пользователя',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
    name: 'comment',
  })
  comment: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Дата создания записи',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T12:45:00Z',
    description: 'Дата последнего обновления',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
