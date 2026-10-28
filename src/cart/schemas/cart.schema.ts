import { Prop, Schema } from '@nestjs/mongoose';
import  {SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;
}

const cartItemSchema = SchemaFactory.createForClass(CartItem)

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [cartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);


