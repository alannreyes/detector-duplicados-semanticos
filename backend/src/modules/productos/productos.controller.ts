import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(@Query('limit') limit: number = 100) {
    return await this.productosService.findAll();
  }

  @Get('stats')
  async getStats() {
    const total = await this.productosService.countTotal();
    const conEmbeddings = await this.productosService.getAllWithEmbeddings();

    return {
      totalProductos: total,
      productosConEmbeddings: conEmbeddings.length,
      porcentajeConEmbeddings: (conEmbeddings.length / total) * 100,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productosService.findById(id);
  }
}