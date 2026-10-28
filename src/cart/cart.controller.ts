import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { CartItem } from './schemas/cart.schema';
import request from 'supertest';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() request: Request & { user: { userId: string } }) {
    const userId = request.user.userId;
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  addToCart(
    @Req() request: Request & { user: { userId: string } },
    @Body('productId') productId: string,
  ) {
    const userId = request.user.userId;
    return this.cartService.addToCart(userId, productId);
  }

  @Delete('items/:productId')
  @UseGuards(JwtAuthGuard)
  removeFromCart(
    @Req() request: Request & { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    const userId = request.user.userId;
    return this.cartService.removeFromCart(userId, productId);
  }

  @Patch('items/:productId')
  @UseGuards(JwtAuthGuard)
  decreaseProduct(@Req() request: Request & { user: { userId: string } }, @Param('productId') productId: string) {
    const userId = request.user.userId;
    return this.cartService.decreaseQuantity(userId, productId);
  }

  @Delete('items')
  @UseGuards(JwtAuthGuard)
  clearCart(@Req() request: Request & { user: { userId: string } }) {
    const userId = request.user.userId;
    return this.cartService.clearCart(userId);
  }
}
