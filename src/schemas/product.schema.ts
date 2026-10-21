import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductDimensions {
  @Prop({ type: Number, default: 0 })
  width: number;

  @Prop({ type: Number, default: 0 })
  height: number;

  @Prop({ type: Number, default: 0 })
  depth: number;
}

export const ProductDimensionsSchema =
  SchemaFactory.createForClass(ProductDimensions);

@Schema({ _id: false })
export class ProductReview {
  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  reviewerName: string;

  @Prop({ type: String, required: true })
  reviewerEmail: string;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);

@Schema({ _id: false })
export class ProductMeta {
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: String })
  barcode: string;

  @Prop({ type: String })
  qrCode: string;
}

export const ProductMetaSchema = SchemaFactory.createForClass(ProductMeta);

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  test: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: false, default: false })
  favorite: boolean;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  discountPercentage: number;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String })
  brand?: string;

  @Prop({ type: String })
  sku: string;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ type: ProductDimensionsSchema })
  dimensions: ProductDimensions;

  @Prop({ type: String })
  warrantyInformation: string;

  @Prop({ type: String })
  shippingInformation: string;

  @Prop({ type: String, default: 'In Stock' })
  availabilityStatus: string;

  @Prop({ type: [ProductReviewSchema], default: [] })
  reviews: ProductReview[];

  @Prop({ type: String })
  returnPolicy: string;

  @Prop({ type: Number, default: 1, min: 1 })
  minimumOrderQuantity: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: ProductMetaSchema })
  meta?: ProductMeta;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
