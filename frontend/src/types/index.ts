export interface SearchConfig {
  umbral: number;
  usarOpenAI: boolean;
  nivelOpenAI: 'estricto' | 'moderado' | 'flexible';
}

export interface Producto {
  id: number;
  codigo: string;
  descripcion: string;
  marca: string;
  categoria: string;
  similitudConPrincipal: number;
}

export interface GrupoDuplicados {
  id: number;
  confianza: number | null;
  estado: 'duplicado_confirmado' | 'posible_duplicado' | 'altamente_sospechoso';
  analisisOpenAI: string | null;
  productos: Producto[];
}

export interface SearchResult {
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

export interface BusquedaIndividual {
  descripcion: string;
  umbral: number;
  usarOpenAI: boolean;
  nivelOpenAI: 'estricto' | 'moderado' | 'flexible';
}

export interface BusquedaPorRango {
  desdeId: number;
  hastaId: number;
  umbral: number;
  usarOpenAI: boolean;
  nivelOpenAI: 'estricto' | 'moderado' | 'flexible';
}

export interface BusquedaPorCategoria {
  categoria: string;
  umbral: number;
  usarOpenAI: boolean;
  nivelOpenAI: 'estricto' | 'moderado' | 'flexible';
}