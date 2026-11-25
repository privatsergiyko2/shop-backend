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
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';


@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@Req() request: Request & { user: { userId: string } }) {
    const userId = request.user.userId;
    return this.favoritesService.getFavorites(userId);
  }

  @Post()
  addFavorite(
    @Req() request: Request & { user: { userId: string } },
    @Body('productId') productId: string,
  ) {
    const userId = request.user.userId;
    return this.favoritesService.addFavorite(productId, userId);
  }

  @Delete(':productId')
  deleteFavorite(
    @Req() request: Request & { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    const userId = request.user.userId;
    return this.favoritesService.deleteFavorite(productId, userId);
  }
}