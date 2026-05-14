import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TOILET_LOCATION, TOILET_PERSON } from '../enum/toilets.enum';

@Entity({ name: 'toilets' })
export class ToiletEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор туалета' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Туалет в ТЦ "Европа"',
    description: 'Название или местоположение туалета',
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'name',
  })
  name: string;

  @ApiProperty({
    example: TOILET_PERSON.MAN,
    description: 'Гендер',
    required: true,
  })
  @Column({
    type: 'enum',
    name: 'person',
    enum: TOILET_PERSON,
    nullable: false,
    default: TOILET_PERSON.MAN,
  })
  person: TOILET_PERSON;

  @ApiProperty({
    enum: TOILET_LOCATION,
    example: TOILET_LOCATION.FIRST_BUILDING,
    description: 'Местоположение туалета',
    required: true,
  })
  @Column({
    type: 'enum',
    enum: TOILET_LOCATION,
    name: 'location',
    nullable: false,
    default: TOILET_LOCATION.FIRST_BUILDING,
  })
  location: TOILET_LOCATION;

  @ApiProperty({
    example: '1',
    required: true,
  })
  @Column({
    default: 1,
    nullable: false,
  })
  floor: number;

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

  @ApiProperty({
    type: () => [ToiletRatingEntity],
    description: 'Список оценок туалета',
  })
  @OneToMany(() => ToiletRatingEntity, (rating) => rating.toilet, {
    cascade: true,
  })
  ratings: ToiletRatingEntity[];
}

@Entity({ name: 'toilet_ratings' })
export class ToiletRatingEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор оценки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 4,
    description: 'Оценка запаха от 1 до 5',
    nullable: true,
    minimum: 1,
    maximum: 5,
  })
  @Column({
    type: 'int',
    name: 'smell_rating',
  })
  smellRating: number;

  @ApiProperty({
    example: 5,
    description: 'Оценка чистоты от 1 до 5',
    minimum: 1,
    maximum: 5,
  })
  @Column({
    type: 'int',
    name: 'purity_rating',
  })
  purityRating: number;

  @ApiProperty({
    example: true,
    description: 'Наличие туалетной бумаги',
    default: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    name: 'has_toilet_paper',
  })
  hasToiletPaper: boolean;

  @ApiProperty({ example: false, description: 'Наличие мыла', default: false })
  @Column({
    type: 'boolean',
    default: false,
    name: 'has_soap',
  })
  hasSoap: boolean;

  @ApiProperty({
    example: 'Чисто, но нет бумаги',
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

  @ManyToOne(() => ToiletEntity, (toilet) => toilet.ratings, {
    onDelete: 'CASCADE',
  })
  toilet: ToiletEntity;
}
