import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  productId!: string;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  price!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  country!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  address!: string;

  @Prop()
  apartment?: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  region!: string;

  @Prop({ required: true })
  postalCode!: string;
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId!: string;

  @Prop()
  stripePaymentIntentId?: string;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true, enum: ['standard', 'express', 'pickup'] })
  deliveryMethod!: string;

  @Prop({ required: true })
  total!: number;

  @Prop({
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  })
  paymentStatus!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
