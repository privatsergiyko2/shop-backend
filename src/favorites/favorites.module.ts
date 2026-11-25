import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorites, FavoritesSchema } from './schema/favorites.schema';
import {AuthModule} from '../auth/auth.module';
@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [MongooseModule.forFeature([{ name: Favorites.name, schema: FavoritesSchema }]), AuthModule],
})
export class FavoritesModule {}
