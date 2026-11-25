import { Inject, Injectable } from '@nestjs/common';
import { Review } from './review.schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly authService: AuthService,
  ) {}

  async getReviews() {
    const reviews = await this.reviewModel.find();
    return reviews;
  }

  async addReview(review: Review) {
    const newReview = this.reviewModel.create(review);
    return newReview;
  }

  getReviewsByProduct(productId: string) {
    const getOneReview = this.reviewModel.find({ productId: productId });
    return getOneReview;
  }


  async deleteReview(id: string, userId: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const user = await this.authService.findUserById(userId);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (review.userId !== userId && user.role !== 1) {
      throw new ForbiddenException('You cannot delete this review');
    }

    return this.reviewModel.findByIdAndDelete(id)
  }

}
