import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ValidacionOpenAI {
  sonIdenticos: boolean;
  certeza: number;
  explicacion: string;
  tipoProducto?: string;
  especificacionesComunes?: string[];
  diferencias?: string[];
  recomendacion?: string;
}

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * Genera un embedding para una descripción de producto
   */
  async generarEmbedding(descripcion: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key no configurada');
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: descripcion,
        dimensions: 1024,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generando embedding:', error);
      throw error;
    }
  }

  /**
   * Valida si un grupo de productos son duplicados usando GPT
   */
  async validarDuplicados(
    productos: any[],
    nivel: 'estricto' | 'moderado' | 'flexible' = 'moderado',
  ): Promise<ValidacionOpenAI> {
    if (!this.openai) {
      return {
        sonIdenticos: false,
        certeza: 0,
        explicacion: 'OpenAI no configurado',
      };
    }

    try {
      const prompt = this.construirPromptValidacion(productos, nivel);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en análisis de productos y detección de duplicados en bases de datos.
            Tu tarea es determinar si los productos presentados son el mismo artículo descrito de diferentes formas.
            Debes responder en formato JSON válido.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const resultado = JSON.parse(response.choices[0].message.content || '{}');
      return this.procesarRespuestaOpenAI(resultado);
    } catch (error) {
      console.error('Error validando con OpenAI:', error);
      return {
        sonIdenticos: false,
        certeza: 0,
        explicacion: 'Error al procesar con OpenAI',
      };
    }
  }

  private construirPromptValidacion(productos: any[], nivel: string): string {
    const productosTexto = productos
      .map(
        (p, i) => `
Producto ${i + 1}:
- ID: ${p.id}
- Código: ${p.codigo}
- Descripción: ${p.descripcion}
- Marca: ${p.marca || 'No especificada'}
- Categoría: ${p.categoria || 'No especificada'}
`,
      )
      .join('\n');

    const criterioTexto = {
      estricto:
        'Criterio ESTRICTO: Solo considerar idénticos si son exactamente el mismo modelo, marca y especificaciones.',
      moderado:
        'Criterio MODERADO: Considerar idénticos si son el mismo producto aunque varíen detalles menores de descripción.',
      flexible:
        'Criterio FLEXIBLE: Considerar idénticos si son productos muy similares aunque puedan tener pequeñas diferencias.',
    };

    return `Analiza los siguientes productos y determina si son duplicados (el mismo producto descrito de diferentes formas):

${productosTexto}

${criterioTexto[nivel]}

Responde con un JSON que contenga:
{
  "sonIdenticos": boolean,
  "certeza": número del 0 al 100,
  "explicacion": "explicación breve",
  "tipoProducto": "descripción del producto si son idénticos",
  "especificacionesComunes": ["lista de specs comunes"],
  "diferencias": ["lista de diferencias encontradas"],
  "recomendacion": "recomendación para unificar o acción sugerida"
}`;
  }

  private procesarRespuestaOpenAI(respuesta: any): ValidacionOpenAI {
    return {
      sonIdenticos: respuesta.sonIdenticos || false,
      certeza: respuesta.certeza || 0,
      explicacion: respuesta.explicacion || '',
      tipoProducto: respuesta.tipoProducto,
      especificacionesComunes: respuesta.especificacionesComunes || [],
      diferencias: respuesta.diferencias || [],
      recomendacion: respuesta.recomendacion || '',
    };
  }
}