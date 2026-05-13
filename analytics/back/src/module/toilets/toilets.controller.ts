import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ToiletsService } from './toilets.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ToiletCreateRatingDto,
  ToiletRatingResDto,
} from './dto/toilets-rating.dto';
import { ToiletCreateDto, ToiletResDto } from './dto/toilets.dto';

@ApiTags('Туалеты')
@Controller('toilets')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все туалеты с отзывами' })
  @ApiResponse({ type: [ToiletResDto] })
  async getAllToilets() {
    return await this.toiletsService.fetchAllToilets();
  }

  @Get('ratings')
  @ApiOperation({ summary: 'Получить все отзывы' })
  @ApiResponse({ type: [ToiletRatingResDto] })
  async getAllRatings() {
    return await this.toiletsService.fetchAllRatings();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить туалет по ID с его отзывами' })
  @ApiResponse({ type: ToiletResDto })
  async getToiletById(@Param('id') id: number) {
    return await this.toiletsService.fetchToiletById(id);
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Получить все отзывы конкретного туалета' })
  @ApiResponse({ type: [ToiletRatingResDto] })
  async getRatingsByToilet(@Param('id') id: number) {
    return await this.toiletsService.fetchRatingsByToilet(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый туалет' })
  @ApiResponse({ type: ToiletResDto })
  async createToilet(@Body() createToiletDto: ToiletCreateDto) {
    return await this.toiletsService.createToilet(createToiletDto);
  }

  @Post(':id/ratings')
  @ApiOperation({ summary: 'Добавить отзыв к туалету' })
  @ApiResponse({ type: ToiletRatingResDto })
  async addRating(
    @Param('id') id: number,
    @Body() createRatingDto: ToiletCreateRatingDto,
  ) {
    return await this.toiletsService.addRating(id, createRatingDto);
  }
}
