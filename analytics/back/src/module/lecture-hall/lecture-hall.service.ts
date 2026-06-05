import { Injectable, NotFoundException } from '@nestjs/common';
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

  // НОВЫЕ DELETE МЕТОДЫ:

  async deleteLectureHall(id: number) {
    const lectureHall = await this.lectureHallRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });

    if (!lectureHall) {
      throw new NotFoundException(`Лекционный зал с ID ${id} не найден`);
    }

    // Удаляем все связанные отзывы (если нет каскадного удаления в БД)
    if (lectureHall.ratings && lectureHall.ratings.length > 0) {
      await this.ratingRepository.remove(lectureHall.ratings);
    }

    // Удаляем сам лекционный зал
    const result = await this.lectureHallRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Лекционный зал с ID ${id} не найден`);
    }

    return { message: `Лекционный зал с ID ${id} успешно удален` };
  }

  async deleteRating(ratingId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new NotFoundException(`Отзыв с ID ${ratingId} не найден`);
    }

    const result = await this.ratingRepository.delete(ratingId);

    if (result.affected === 0) {
      throw new NotFoundException(`Отзыв с ID ${ratingId} не найден`);
    }

    return { message: `Отзыв с ID ${ratingId} успешно удален` };
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { LectureHallCreateDto } from './dto/lecture-hall.dto';
// import {
//   LectureHallEntity,
//   LectureHallRatingEntity,
// } from './entity/lecture-hall.entity';
// import { LectureHallRatingCreateDto } from './dto/lecture-hall-rating.dto';

// @Injectable()
// export class LectureHallService {
//   constructor(
//     @InjectRepository(LectureHallEntity)
//     private readonly lectureHallRepository: Repository<LectureHallEntity>,
//     @InjectRepository(LectureHallRatingEntity)
//     private readonly ratingRepository: Repository<LectureHallRatingEntity>,
//   ) {}

//   async fetchAllLectureHalls() {
//     return await this.lectureHallRepository.find({
//       relations: ['ratings'],
//       order: {
//         createdAt: 'DESC',
//       },
//     });
//   }

//   async fetchAllRatings() {
//     return await this.ratingRepository.find({
//       relations: ['lectureHall'],
//       order: {
//         createdAt: 'DESC',
//       },
//     });
//   }

//   async fetchRatingsByLectureHall(lectureHallId: number) {
//     return await this.ratingRepository.find({
//       where: { lectureHall: { id: lectureHallId } },
//       relations: ['lectureHall'],
//       order: {
//         createdAt: 'DESC',
//       },
//     });
//   }

//   async fetchLectureHallById(id: number) {
//     return await this.lectureHallRepository.findOne({
//       where: { id },
//       relations: ['ratings'],
//     });
//   }

//   async createLectureHall(dto: LectureHallCreateDto) {
//     const newLectureHall = this.lectureHallRepository.create(dto);
//     return await this.lectureHallRepository.save(newLectureHall);
//   }

//   async addRating(
//     lectureHallId: number,
//     createRatingDto: LectureHallRatingCreateDto,
//   ) {
//     const lectureHall = await this.lectureHallRepository.findOne({
//       where: { id: lectureHallId },
//     });

//     if (!lectureHall) {
//       throw new Error(`Лекционный зал с ID ${lectureHallId} не найден`);
//     }

//     const newRating = this.ratingRepository.create({
//       ...createRatingDto,
//       lectureHall: lectureHall,
//     });

//     return await this.ratingRepository.save(newRating);
//   }
// }
