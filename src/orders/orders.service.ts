import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const productIds = createOrderDto.items.map((item) => item.productId);

    const products = await this.productModel.find({
      _id: { $in: productIds },
    });

    const uniqueProducts = new Set(productIds);

    if (products.length !== uniqueProducts.size) {
      throw new NotFoundException('Some products not found');
    }

    const orderItems = products.map((product) => {
      const cartItem = createOrderDto.items.find(
        (item) => item.productId === product._id.toString(),
      );
      if (!cartItem) {
        throw new BadRequestException('Cart item not found');
      }

      if (cartItem.quantity > product.stock) {
        throw new BadRequestException('Not enough stock');
      }

      const discountedPrice =
        product.price * (1 - product.discountPercentage / 100);

      return {
        productId: product._id.toString(),
        quantity: cartItem.quantity,
        price: discountedPrice,
      };
    });
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    let shippingCost = 0;
    if (createOrderDto.deliveryMethod === 'standard') {
      shippingCost = 4.99;
    } else if (createOrderDto.deliveryMethod === 'express') {
      shippingCost = 9.99;
    }
    const total = Math.round((subtotal + shippingCost) * 100) / 100;
    const order = await this.orderModel.create({
      userId: userId,
      items: orderItems,
      shippingAddress: createOrderDto.shippingAddress,
      deliveryMethod: createOrderDto.deliveryMethod,
      total: total,
      paymentStatus: 'pending',
    });
    return order;
  }

  async findOrderById(orderId: string, userId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if(order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      paymentStatus: order.paymentStatus
    };
  }

  async findMyOrders(userId: string) {
   return this.orderModel.find({userId: userId}).sort({createdAt: -1})
  }
}
