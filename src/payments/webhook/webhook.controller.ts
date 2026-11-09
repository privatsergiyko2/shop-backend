import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { PaymentsService } from '../payments.service';

@Controller('payments/webhook')
export class WebhookController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  handleWebhooks(
    @Headers('stripe-signature') stripeSignature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!request.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    if (!stripeSignature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    return this.paymentsService.handleWebhook(
      request.rawBody,
      stripeSignature,
    );
  }
}
