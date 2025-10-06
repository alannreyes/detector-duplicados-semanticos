import { Injectable } from '@nestjs/common';

@Injectable()
export class SimilitudService {
  /**
   * Calcula la similitud coseno entre dos vectores
   * @param vec1 Primer vector de embeddings
   * @param vec2 Segundo vector de embeddings
   * @returns Valor de similitud entre 0 y 1
   */
  calcularSimilitudCoseno(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length || vec1.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Encuentra los productos más similares a un embedding dado
   * @param targetEmbedding Embedding objetivo
   * @param productos Lista de productos con embeddings
   * @param umbral Umbral mínimo de similitud
   * @param maxResults Número máximo de resultados
   */
  encontrarSimilares(
    targetEmbedding: number[],
    productos: Array<{ id: number; embedding: number[]; [key: string]: any }>,
    umbral: number = 0.75,
    maxResults: number = 50,
  ): Array<{ producto: any; similitud: number }> {
    const similitudes = productos
      .map(producto => ({
        producto,
        similitud: this.calcularSimilitudCoseno(targetEmbedding, producto.embedding),
      }))
      .filter(item => item.similitud >= umbral)
      .sort((a, b) => b.similitud - a.similitud)
      .slice(0, maxResults);

    return similitudes;
  }

  /**
   * Agrupa productos por similitud
   * @param productos Lista de productos con embeddings
   * @param umbral Umbral mínimo de similitud para considerar duplicados
   */
  agruparDuplicados(
    productos: Array<{ id: number; embedding: number[]; [key: string]: any }>,
    umbral: number = 0.75,
  ): Array<Array<{ producto: any; similitud: number }>> {
    const grupos: Array<Array<{ producto: any; similitud: number }>> = [];
    const procesados = new Set<number>();

    for (const producto of productos) {
      if (procesados.has(producto.id)) {
        continue;
      }

      const grupo: Array<{ producto: any; similitud: number }> = [
        { producto, similitud: 1.0 },
      ];
      procesados.add(producto.id);

      // Buscar productos similares
      for (const otroProducto of productos) {
        if (procesados.has(otroProducto.id)) {
          continue;
        }

        const similitud = this.calcularSimilitudCoseno(
          producto.embedding,
          otroProducto.embedding,
        );

        if (similitud >= umbral) {
          grupo.push({ producto: otroProducto, similitud });
          procesados.add(otroProducto.id);
        }
      }

      // Solo agregar grupos con más de un producto
      if (grupo.length > 1) {
        grupos.push(grupo);
      }
    }

    return grupos;
  }
}