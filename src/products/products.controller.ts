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

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() body: Partial<Product>) {
    const productUpdate = await this.productModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!productUpdate) {
      throw new NotFoundException('Product not found');
    }
    return productUpdate;
  }

  @Post('add')
  async addProduct(@Body() body: any) {
    return await this.productModel.create(body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const deleteProd = await this.productModel.findByIdAndDelete(id);
    if (!deleteProd) {
      throw new NotFoundException();
    }
    return deleteProd;
  }
}
