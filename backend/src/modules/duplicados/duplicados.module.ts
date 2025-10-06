import { Module } from '@nestjs/common';
import { DuplicadosService } from './duplicados.service';
import { DuplicadosController } from './duplicados.controller';
import { ProductosModule } from '../productos/productos.module';
import { OpenAIModule } from '../openai/openai.module';
import { SimilitudService } from './similitud.service';

@Module({
  imports: [ProductosModule, OpenAIModule],
  providers: [DuplicadosService, SimilitudService],
  controllers: [DuplicadosController],
  exports: [DuplicadosService],
})
export class DuplicadosModule {}