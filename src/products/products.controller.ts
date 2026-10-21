import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Counter } from '../schemas/counter.schema';

@Controller('products')
export class ProductsController {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,

    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
  ) {}

  @Get()
  async getProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data;
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const mongoProduct = await this.productModel.findOne({
      id: Number(id),
    });
  if(mongoProduct) {
    return mongoProduct;
  }
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  @Post('add')
  async addProduct(@Body() body: any) {
    const counterInc = await this.counterModel.findOneAndUpdate(
      { name: 'productId' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    );
    if (!counterInc) {
      throw new Error('Не вдалося отримати лічильник');
    }
    body.id = 999999 + counterInc.seq;
    const product = await this.productModel.create(body);
    return product;
  }
}
