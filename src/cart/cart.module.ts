import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Cart, CartSchema } from './schemas/cart.schema';
import {AuthModule} from '../auth/auth.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([
      {name: Cart.name, schema: CartSchema},
    ]),
    AuthModule,
  ]
})
export class CartModule {}
