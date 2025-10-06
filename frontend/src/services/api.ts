import axios from 'axios';
import {
  BusquedaIndividual,
  BusquedaPorRango,
  BusquedaPorCategoria,
  SearchResult,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function searchByDescription(
  data: BusquedaIndividual
): Promise<SearchResult> {
  const response = await api.post('/duplicados/buscar-individual', data);
  return response.data;
}

export async function searchByRange(
  data: BusquedaPorRango
): Promise<SearchResult> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${API_URL}/api/duplicados/buscar-rango`
    );

    const requestData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch(`${API_URL}/api/duplicados/buscar-rango`, requestData)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const readStream = async () => {
          if (!reader) return;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'complete') {
                  resolve(data.resultado);
                } else if (data.type === 'error') {
                  reject(new Error(data.message));
                }
              }
            }
          }
        };

        readStream();
      })
      .catch(reject);
  });
}

export async function searchByCategory(
  data: BusquedaPorCategoria
): Promise<SearchResult> {
  const response = await api.post('/duplicados/buscar-categoria', data);
  return response.data;
}

export async function getProductStats() {
  const response = await api.get('/productos/stats');
  return response.data;
}