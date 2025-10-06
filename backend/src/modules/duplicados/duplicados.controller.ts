import { Controller, Post, Body, Get, Param, Query, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { DuplicadosService } from './duplicados.service';
import { BusquedaIndividualDto, BusquedaPorRangoDto, BusquedaPorCategoriaDto } from './dto/duplicados.dto';

@Controller('duplicados')
export class DuplicadosController {
  constructor(private readonly duplicadosService: DuplicadosService) {}

  @Post('buscar-individual')
  async buscarIndividual(@Body() dto: BusquedaIndividualDto) {
    return await this.duplicadosService.buscarPorDescripcion(dto);
  }

  @Post('buscar-rango')
  async buscarPorRango(@Body() dto: BusquedaPorRangoDto, @Res() res: Response) {
    // Configurar SSE para progreso en tiempo real
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Callback para enviar progreso
    dto.onProgress = (progress) => {
      res.write(`data: ${JSON.stringify({ type: 'progress', ...progress })}\n\n`);
    };

    try {
      const resultado = await this.duplicadosService.buscarPorRango(dto);
      res.write(`data: ${JSON.stringify({ type: 'complete', resultado })}\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }

  @Post('buscar-categoria')
  async buscarPorCategoria(@Body() dto: BusquedaPorCategoriaDto) {
    return await this.duplicadosService.buscarPorCategoria(
      dto.categoria,
      dto.umbral,
      dto.usarOpenAI,
    );
  }

  @Get('estadisticas')
  async obtenerEstadisticas() {
    // TODO: Implementar estadísticas generales
    return {
      totalProductos: 0,
      totalConEmbeddings: 0,
      categorias: [],
    };
  }

  @Get('exportar/:formato')
  async exportarResultados(
    @Param('formato') formato: 'csv' | 'excel',
    @Query('grupos') grupos: string,
    @Res() res: Response,
  ) {
    // TODO: Implementar exportación
    const gruposData = JSON.parse(grupos);

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="duplicados.csv"');
      // Generar CSV
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="duplicados.xlsx"');
      // Generar Excel
    }

    res.end();
  }
}