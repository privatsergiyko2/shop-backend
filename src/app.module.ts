import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Product, ProductSchema } from './schemas/product.schema';
import { Counter, CounterSchema } from './schemas/counter.schema';
import { AuthModule } from './auth/auth.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),

    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),

    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'shop-backend',
    }),

    AuthModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
