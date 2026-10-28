import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId: userId });
    if (cart === null) {
      return await this.cartModel.create({ userId: userId, items: [] });
    }
    return cart;
  }

  async addToCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    const cartItem = cart.items.find((it) => it.productId === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.items.push({
        productId: productId,
        quantity: 1,
      });
    }
    return await cart.save();
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((it) => it.productId !== productId);
    return await cart.save();
  }

  async decreaseQuantity(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    const cartItem = cart.items.find((it) => it.productId === productId);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        cart.items = cart.items.filter((it) => it.productId !== productId);
      }
    }
    return await cart.save();
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    return await cart.save();

  }
}
