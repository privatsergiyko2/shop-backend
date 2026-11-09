import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from '../orders/schema/order.schema';
import StripeConstructor from 'stripe';
import Payment = StripeConstructor.InvoicePaymentListParams.Payment;
import { metadata } from 'reflect-metadata/no-conflict';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.orderModel.findById(orderId);
    if (order === null) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You cannot pay for this order');
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Order already paid');
    }
    if (order.stripePaymentIntentId) {
      const existingIntent = await this.stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId,
      );

      if (existingIntent.status === 'succeeded') {
        throw new BadRequestException('Order already paid');
      }

      if (existingIntent.status === 'processing') {
        throw new BadRequestException('Payment is processing');
      }

      if (existingIntent.status === 'canceled') {
        throw new BadRequestException('Payment was canceled');
      }

      if (existingIntent.status === 'requires_capture') {
        throw new BadRequestException('Payment is awaiting capture');
      }

      return { client_secret: existingIntent.client_secret };
    }

    const amount = Math.round(order.total * 100);
    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount,
        currency: 'usd',
        metadata: {
          orderId,
        },
      },
      {
        idempotencyKey: `payment-order-${orderId}`,
      },
    );

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    return {
      client_secret: paymentIntent.client_secret,
    };
  }
  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    if (
      event.type !== 'payment_intent.succeeded' &&
      event.type !== 'payment_intent.payment_failed'
    ) {
      return { received: true };
    }

    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      console.log('Webhook event:', event.type);
      console.log('Order ID exists:', Boolean(orderId));
      throw new BadRequestException('Invalid order ID in Stripe event');
    }

    const order = await this.orderModel.findOne({
      _id: orderId,
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!order) {
      throw new NotFoundException('Order not found for this payment');
    }

    if (
      paymentIntent.amount !== Math.round(order.total * 100) ||
      paymentIntent.currency !== 'usd'
    ) {
      throw new BadRequestException('Payment amount or currency mismatch');
    }

    if (event.type === 'payment_intent.succeeded') {
      if (
        paymentIntent.amount_received !== Math.round(order.total * 100)
      ) {
        throw new BadRequestException('Incorrect received payment amount');
      }

      if (order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        await order.save();
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      if (order.paymentStatus !== 'paid') {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }

    return { received: true };
  }

  async getPaymentStatus(orderId: string, userId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.paymentStatus === 'paid' || !order.stripePaymentIntentId) {
      return { paymentStatus: order.paymentStatus };
    }

    const intent = await this.stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

    const expectedAmount = Math.round(order.total * 100);

    if (
      intent.metadata.orderId !== orderId ||
      intent.amount !== expectedAmount ||
      intent.currency !== 'usd'
    ) {
      throw new BadRequestException('Payment details mismatch');
    }

    if (intent.status === 'succeeded') {
      if (intent.amount_received !== expectedAmount) {
        throw new BadRequestException('Incorrect received amount');
      }

      order.paymentStatus = 'paid';
      await order.save();
    }

    return { paymentStatus: order.paymentStatus };
  }
}
