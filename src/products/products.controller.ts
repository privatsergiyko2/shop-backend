import {Controller, Get, Param, Delete, Patch, Body} from '@nestjs/common';


@Controller('products')
export class ProductsController {

  @Get()
  async getProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data;
  }

  @Get(":id")
  async getProductById(@Param('id') id: string) {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await response.json()
    return data;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {method: 'DELETE'});
    const data = await response.json()
    return data;
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return data;

  }
}
