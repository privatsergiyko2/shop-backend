import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Favorites {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);

FavoritesSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);