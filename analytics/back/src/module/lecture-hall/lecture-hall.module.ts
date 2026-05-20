import { Module } from '@nestjs/common';
import { LectureHallService } from './lecture-hall.service';
import { LectureHallController } from './lecture-hall.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LectureHallEntity,
  LectureHallRatingEntity,
} from './entity/lecture-hall.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LectureHallEntity, LectureHallRatingEntity]),
  ],
  controllers: [LectureHallController],
  providers: [LectureHallService],
})
export class LectureHallModule {}
