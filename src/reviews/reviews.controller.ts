import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.schema/review.schema';
import {CreateReviewDto} from './dto/create-review.dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';


@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews() {
    return this.reviewsService.getReviews();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request & { user: { userId: string } }
  ) {
    return this.reviewsService.addReview({
      ...createReviewDto,
      userId: req.user.userId
    });
  }

  @Get('product/:productId')
  getReviewsByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getReviewsByProduct(productId);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteReview(@Param('id') id: string, @Req() req: Request & { user: { userId: string } }) {
    const userId = req.user.userId;
    return this.reviewsService.deleteReview(id, userId);
  }


}
