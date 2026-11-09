import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { Request } from 'express';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto/create-payment-intent.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post()
  @UseGuards(JwtAuthGuard)
  createPaymentIntent(@Body() dto: CreatePaymentIntentDto, @Req() request: Request & { user: { userId: string } }, ) {
    const orderId = dto.orderId;
    const userId = request.user.userId;
    return this.paymentsService.createPaymentIntent(orderId, userId);
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(
    @Param('orderId') orderId: string,
    @Req() request: Request & { user: { userId: string } }
  ) {
    return this.paymentsService.getPaymentStatus(
      orderId,
      request.user.userId
    );
  }
}
