import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true })
  productId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productTitle: string;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
