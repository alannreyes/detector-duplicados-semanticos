import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsEnum } from 'class-validator';

export enum NivelOpenAI {
  ESTRICTO = 'estricto',
  MODERADO = 'moderado',
  FLEXIBLE = 'flexible',
}

export class BusquedaIndividualDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  umbral: number = 0.75;

  @IsBoolean()
  @IsOptional()
  usarOpenAI?: boolean = false;

  @IsEnum(NivelOpenAI)
  @IsOptional()
  nivelOpenAI?: NivelOpenAI = NivelOpenAI.MODERADO;
}

export class BusquedaPorRangoDto {
  @IsNumber()
  @Min(1)
  desdeId: number;

  @IsNumber()
  @Min(1)
  hastaId: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  umbral: number = 0.75;

  @IsBoolean()
  @IsOptional()
  usarOpenAI?: boolean = false;

  @IsEnum(NivelOpenAI)
  @IsOptional()
  nivelOpenAI?: NivelOpenAI = NivelOpenAI.MODERADO;

  onProgress?: (progress: ProgressInfo) => void;
}

export class BusquedaPorCategoriaDto {
  @IsString()
  categoria: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  umbral: number = 0.75;

  @IsBoolean()
  @IsOptional()
  usarOpenAI?: boolean = false;

  @IsEnum(NivelOpenAI)
  @IsOptional()
  nivelOpenAI?: NivelOpenAI = NivelOpenAI.MODERADO;
}

export interface ProgressInfo {
  actual: number;
  total: number;
  porcentaje: number;
}

export interface ResultadoDuplicados {
  configuracion: {
    umbral: number;
    openAIUsado: boolean;
    tiempoProcesamiento: string;
  };
  resultados: {
    totalGrupos: number;
    totalDuplicados: number;
    grupos: GrupoDuplicados[];
  };
}

export interface GrupoDuplicados {
  id: number;
  confianza: number | null;
  estado: 'duplicado_confirmado' | 'posible_duplicado' | 'altamente_sospechoso';
  analisisOpenAI: string | null;
  productos: ProductoDuplicado[];
}

export interface ProductoDuplicado {
  id: number;
  codigo: string;
  descripcion: string;
  marca: string;
  categoria: string;
  similitudConPrincipal: number;
}