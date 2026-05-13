import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToiletEntity, ToiletRatingEntity } from './entity/toilets.entity';
import { Repository } from 'typeorm';
import { ToiletCreateRatingDto } from './dto/toilets-rating.dto';
import { ToiletCreateDto } from './dto/toilets.dto';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly toiletRepository: Repository<ToiletEntity>,
    @InjectRepository(ToiletRatingEntity)
    private readonly ratingRepository: Repository<ToiletRatingEntity>,
  ) {}

  async fetchAllToilets() {
    return await this.toiletRepository.find({
      relations: ['ratings'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchAllRatings() {
    return await this.ratingRepository.find({
      relations: ['toilet'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchRatingsByToilet(toiletId: number) {
    return await this.ratingRepository.find({
      where: { toilet: { id: toiletId } },
      relations: ['toilet'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async fetchToiletById(id: number) {
    return await this.toiletRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });
  }

  async createToilet(dto: ToiletCreateDto) {
    const newToilet = this.toiletRepository.create(dto);
    return await this.toiletRepository.save(newToilet);
  }

  async addRating(toiletId: number, createRatingDto: ToiletCreateRatingDto) {
    const toilet = await this.toiletRepository.findOne({
      where: { id: toiletId },
    });

    if (!toilet) {
      throw new Error(`Туалет с ID ${toiletId} не найден`);
    }

    const newRating = this.ratingRepository.create({
      ...createRatingDto,
      toilet: toilet,
    });

    return await this.ratingRepository.save(newRating);
  }
}
