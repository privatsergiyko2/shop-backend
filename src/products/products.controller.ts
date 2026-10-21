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
  ) {}

  @Get()
  async getProducts() {
    return {
      products: await this.productModel.find(),
    };
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productModel.findOne({
      _id: id,
    });
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
    return await this.productModel.create(body);
  }
}
