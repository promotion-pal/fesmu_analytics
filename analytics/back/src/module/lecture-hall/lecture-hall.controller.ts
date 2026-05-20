import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LectureHallService } from './lecture-hall.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LectureHallRatingCreateDto,
  LectureHallRatingResDto,
} from './dto/lecture-hall-rating.dto';
import {
  LectureHallCreateDto,
  LectureHallResDto,
} from './dto/lecture-hall.dto';

@ApiTags('Лекционные залы')
@Controller('lecture-hall')
export class LectureHallController {
  constructor(private readonly lectureHallService: LectureHallService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все лекционные залы с отзывами' })
  @ApiResponse({ type: [LectureHallResDto] })
  async getAllLectureHalls() {
    return await this.lectureHallService.fetchAllLectureHalls();
  }

  @Get('ratings')
  @ApiOperation({ summary: 'Получить все отзывы о лекционных залах' })
  @ApiResponse({ type: [LectureHallRatingResDto] })
  async getAllRatings() {
    return await this.lectureHallService.fetchAllRatings();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить лекционный зал по ID с его отзывами' })
  @ApiResponse({ type: LectureHallResDto })
  async getLectureHallById(@Param('id') id: number) {
    return await this.lectureHallService.fetchLectureHallById(id);
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Получить все отзывы конкретного лекционного зала' })
  @ApiResponse({ type: [LectureHallRatingResDto] })
  async getRatingsByLectureHall(@Param('id') id: number) {
    return await this.lectureHallService.fetchRatingsByLectureHall(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый лекционный зал' })
  @ApiResponse({ type: LectureHallResDto })
  async createLectureHall(@Body() createLectureHallDto: LectureHallCreateDto) {
    return await this.lectureHallService.createLectureHall(
      createLectureHallDto,
    );
  }

  @Post(':id/ratings')
  @ApiOperation({ summary: 'Добавить отзыв к лекционному залу' })
  @ApiResponse({ type: LectureHallRatingResDto })
  async addRating(
    @Param('id') id: number,
    @Body() createRatingDto: LectureHallRatingCreateDto,
  ) {
    return await this.lectureHallService.addRating(id, createRatingDto);
  }
}
