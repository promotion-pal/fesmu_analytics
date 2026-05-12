import { Module } from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { ToiletsController } from './toilets.controller';
import { ToiletEntity, ToiletRatingEntity } from './entity/toilets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletEntity, ToiletRatingEntity])],
  controllers: [ToiletsController],
  providers: [ToiletsService],
})
export class ToiletsModule {}
