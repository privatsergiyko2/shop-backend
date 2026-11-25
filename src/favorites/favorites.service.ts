import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorites, FavoritesSchema } from './schema/favorites.schema';
import { Model } from 'mongoose';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites.name)
    private readonly favoritesModel: Model<Favorites>,
  ) {}

  async getFavorites(userId: string) {
    const favorites = await this.favoritesModel.find({ userId: userId });
    return favorites;
  }

  async addFavorite(productId: string, userId: string) {
    const addToFavorite = await this.favoritesModel.create({
      productId,
      userId,
    });
    return addToFavorite;
  }

  async deleteFavorite(productId: string, userId: string) {
    const deleteFromFavorites = await this.favoritesModel.findOneAndDelete({
      productId,
      userId,
    });
    return deleteFromFavorites;
  }
}
