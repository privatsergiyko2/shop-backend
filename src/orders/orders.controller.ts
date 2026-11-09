import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request & { user: { userId: string } },
  ) {
    const userId = request.user.userId;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(
    @Param('id') orderId: string,
    @Req() request: Request & { user: { userId: string } },
  ) {
    return this.orderService.findOrderById(orderId, request.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Req() request: Request & { user: { userId: string } }) {
    return this.orderService.findMyOrders(request.user.userId);
  }
}
