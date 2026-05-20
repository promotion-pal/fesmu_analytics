import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureHallCreateDto } from './dto/lecture-hall.dto';
import {
  LectureHallEntity,
  LectureHallRatingEntity,
} from './entity/lecture-hall.entity';
import { LectureHallRatingCreateDto } from './dto/lecture-hall-rating.dto';

@Injectable()
export class LectureHallService {
  constructor(
    @InjectRepository(LectureHallEntity)
    private readonly lectureHallRepository: Repository<LectureHallEntity>,
    @InjectRepository(LectureHallRatingEntity)
    private readonly ratingRepository: Repository<LectureHallRatingEntity>,
  ) {}

  async fetchAllLectureHalls() {
    return await this.lectureHallRepository.find({
      relations: ['ratings'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchAllRatings() {
    return await this.ratingRepository.find({
      relations: ['lectureHall'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchRatingsByLectureHall(lectureHallId: number) {
    return await this.ratingRepository.find({
      where: { lectureHall: { id: lectureHallId } },
      relations: ['lectureHall'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchLectureHallById(id: number) {
    return await this.lectureHallRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });
  }

  async createLectureHall(dto: LectureHallCreateDto) {
    const newLectureHall = this.lectureHallRepository.create(dto);
    return await this.lectureHallRepository.save(newLectureHall);
  }

  async addRating(
    lectureHallId: number,
    createRatingDto: LectureHallRatingCreateDto,
  ) {
    const lectureHall = await this.lectureHallRepository.findOne({
      where: { id: lectureHallId },
    });

    if (!lectureHall) {
      throw new Error(`Лекционный зал с ID ${lectureHallId} не найден`);
    }

    const newRating = this.ratingRepository.create({
      ...createRatingDto,
      lectureHall: lectureHall,
    });

    return await this.ratingRepository.save(newRating);
  }
}
