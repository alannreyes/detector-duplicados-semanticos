import { Injectable } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
import { OpenAIService } from '../openai/openai.service';
import { SimilitudService } from './similitud.service';
import { BusquedaIndividualDto, BusquedaPorRangoDto, ResultadoDuplicados } from './dto/duplicados.dto';

@Injectable()
export class DuplicadosService {
  constructor(
    private productosService: ProductosService,
    private similitudService: SimilitudService,
    private openAIService: OpenAIService,
  ) {}

  /**
   * Busca duplicados para una descripción específica
   */
  async buscarPorDescripcion(dto: BusquedaIndividualDto): Promise<ResultadoDuplicados> {
    const startTime = Date.now();

    // Generar embedding para la nueva descripción
    const nuevoEmbedding = await this.openAIService.generarEmbedding(dto.descripcion);

    // Obtener todos los productos con embeddings
    const productos = await this.productosService.getAllWithEmbeddings();

    // Preparar productos con embeddings parseados
    const productosConEmbedding = productos.map(p => ({
      ...p,
      embedding: p.getEmbeddingArray(),
    }));

    // Encontrar productos similares
    const similares = this.similitudService.encontrarSimilares(
      nuevoEmbedding,
      productosConEmbedding,
      dto.umbral,
    );

    // Si se solicita validación con OpenAI
    let grupos = [similares];
    if (dto.usarOpenAI && similares.length > 0) {
      const validacion = await this.openAIService.validarDuplicados(
        similares.map(s => s.producto),
        dto.nivelOpenAI,
      );
      grupos = this.aplicarValidacionOpenAI(grupos, validacion);
    }

    return {
      configuracion: {
        umbral: dto.umbral,
        openAIUsado: dto.usarOpenAI,
        tiempoProcesamiento: `${(Date.now() - startTime) / 1000}s`,
      },
      resultados: {
        totalGrupos: grupos.length,
        totalDuplicados: similares.length,
        grupos: this.formatearGrupos(grupos),
      },
    };
  }

  /**
   * Busca duplicados en un rango de IDs
   */
  async buscarPorRango(dto: BusquedaPorRangoDto): Promise<ResultadoDuplicados> {
    const startTime = Date.now();

    // Obtener productos en el rango
    const productosRango = await this.productosService.findByRange(dto.desdeId, dto.hastaId);

    // Obtener todos los productos para comparar
    const todosProductos = await this.productosService.getAllWithEmbeddings();

    const grupos = [];
    const procesados = new Set<number>();

    // Para cada producto en el rango
    for (const producto of productosRango) {
      if (procesados.has(producto.id)) {
        continue;
      }

      const embeddingActual = producto.getEmbeddingArray();
      if (embeddingActual.length === 0) {
        continue;
      }

      // Preparar todos los productos con embeddings
      const productosConEmbedding = todosProductos
        .filter(p => p.id !== producto.id)
        .map(p => ({
          ...p,
          embedding: p.getEmbeddingArray(),
        }));

      // Encontrar similares
      const similares = this.similitudService.encontrarSimilares(
        embeddingActual,
        productosConEmbedding,
        dto.umbral,
      );

      if (similares.length > 0) {
        const grupo = [
          { producto, similitud: 1.0 },
          ...similares,
        ];

        // Validar con OpenAI si está habilitado
        if (dto.usarOpenAI) {
          const validacion = await this.openAIService.validarDuplicados(
            grupo.map(g => g.producto),
            dto.nivelOpenAI,
          );

          if (validacion.sonIdenticos) {
            grupos.push({
              productos: grupo,
              validacionOpenAI: validacion,
            });
          }
        } else {
          grupos.push({
            productos: grupo,
          });
        }

        // Marcar como procesados
        grupo.forEach(g => procesados.add(g.producto.id));
      }

      // Callback de progreso
      if (dto.onProgress) {
        dto.onProgress({
          actual: productosRango.indexOf(producto) + 1,
          total: productosRango.length,
          porcentaje: ((productosRango.indexOf(producto) + 1) / productosRango.length) * 100,
        });
      }
    }

    return {
      configuracion: {
        umbral: dto.umbral,
        openAIUsado: dto.usarOpenAI,
        tiempoProcesamiento: `${(Date.now() - startTime) / 1000}s`,
      },
      resultados: {
        totalGrupos: grupos.length,
        totalDuplicados: grupos.reduce((sum, g) => sum + g.productos.length, 0),
        grupos: this.formatearGrupos(grupos),
      },
    };
  }

  /**
   * Busca duplicados por categoría
   */
  async buscarPorCategoria(categoria: string, umbral: number, usarOpenAI: boolean): Promise<ResultadoDuplicados> {
    const startTime = Date.now();

    const productos = await this.productosService.findByCategoria(categoria);
    const productosConEmbedding = productos.map(p => ({
      ...p,
      embedding: p.getEmbeddingArray(),
    }));

    const grupos = this.similitudService.agruparDuplicados(productosConEmbedding, umbral);

    // Aplicar validación OpenAI si está habilitada
    const gruposValidados = usarOpenAI
      ? await this.validarGruposConOpenAI(grupos)
      : grupos;

    return {
      configuracion: {
        umbral,
        openAIUsado: usarOpenAI,
        tiempoProcesamiento: `${(Date.now() - startTime) / 1000}s`,
      },
      resultados: {
        totalGrupos: gruposValidados.length,
        totalDuplicados: gruposValidados.reduce((sum, g) => sum + g.length, 0),
        grupos: this.formatearGrupos(gruposValidados),
      },
    };
  }

  private formatearGrupos(grupos: any[]): any[] {
    return grupos.map((grupo, index) => ({
      id: index + 1,
      confianza: grupo.validacionOpenAI?.certeza || null,
      estado: grupo.validacionOpenAI?.sonIdenticos
        ? 'duplicado_confirmado'
        : 'posible_duplicado',
      analisisOpenAI: grupo.validacionOpenAI?.explicacion || null,
      productos: (grupo.productos || grupo).map(item => ({
        id: item.producto.id,
        codigo: item.producto.codigo,
        descripcion: item.producto.descripcion,
        marca: item.producto.marca,
        categoria: item.producto.categoria,
        similitudConPrincipal: item.similitud,
      })),
    }));
  }

  private async validarGruposConOpenAI(grupos: any[]): Promise<any[]> {
    const gruposValidados = [];

    for (const grupo of grupos) {
      const productos = grupo.map(g => g.producto);
      const validacion = await this.openAIService.validarDuplicados(productos, 'moderado');

      if (validacion.sonIdenticos) {
        gruposValidados.push({
          productos: grupo,
          validacionOpenAI: validacion,
        });
      }
    }

    return gruposValidados;
  }

  private aplicarValidacionOpenAI(grupos: any[], validacion: any): any[] {
    return grupos.map(grupo => ({
      ...grupo,
      validacionOpenAI: validacion,
    }));
  }
}