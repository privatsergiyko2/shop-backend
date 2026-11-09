import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/schema/order.schema';
import { PaymentsController } from './payments.controller';
import { AuthModule } from '../auth/auth.module'
import { WebhookController } from './webhook/webhook.controller';

@Module({
  providers: [PaymentsService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: Order.name, schema: OrderSchema},
    ])
  ],
  controllers: [PaymentsController, WebhookController]

})
export class PaymentsModule {}
