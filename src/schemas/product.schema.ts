import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
  @Prop({ unique: true })
  id: number;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  thumbnail: string;

  @Prop()
  stock: number;

  @Prop()
  brand?: number;

  @Prop()
  category: string;

  @Prop()
  rating: number;

  @Prop()
  discountPercentage: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);