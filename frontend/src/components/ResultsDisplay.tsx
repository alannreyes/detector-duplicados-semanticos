'use client';

import { useState } from 'react';
import { SearchResult, GrupoDuplicados } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { exportToExcel, exportToCSV } from '@/services/export';
import toast from 'react-hot-toast';

interface ResultsDisplayProps {
  results: SearchResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const toggleGroup = (groupId: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      duplicado_confirmado: 'bg-red-100 text-red-800',
      altamente_sospechoso: 'bg-yellow-100 text-yellow-800',
      posible_duplicado: 'bg-blue-100 text-blue-800',
    };
    return badges[estado as keyof typeof badges] || badges.posible_duplicado;
  };

  const handleExportExcel = () => {
    exportToExcel(results.resultados.grupos);
    toast.success('Exportado a Excel');
  };

  const handleExportCSV = () => {
    exportToCSV(results.resultados.grupos);
    toast.success('Exportado a CSV');
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card bg-gradient-to-r from-primary-50 to-green-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📊 Resumen de Resultados
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Procesado en {results.configuracion.tiempoProcesamiento}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="btn-secondary text-sm"
            >
              📥 Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-secondary text-sm"
            >
              📄 CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {results.resultados.totalGrupos}
            </p>
            <p className="text-xs text-gray-600">Grupos encontrados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {results.resultados.totalDuplicados}
            </p>
            <p className="text-xs text-gray-600">Productos duplicados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {results.configuracion.umbral}
            </p>
            <p className="text-xs text-gray-600">Umbral usado</p>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {results.resultados.grupos.map((grupo) => (
          <div key={grupo.id} className="card">
            <div
              className="flex justify-between items-start cursor-pointer"
              onClick={() => toggleGroup(grupo.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">
                    Grupo #{grupo.id}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(
                      grupo.estado
                    )}`}
                  >
                    {grupo.estado.replace('_', ' ')}
                  </span>
                  {grupo.confianza && (
                    <span className="text-sm text-gray-500">
                      Confianza: {grupo.confianza}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {grupo.productos.length} productos en este grupo
                </p>
                {grupo.analisisOpenAI && (
                  <p className="text-sm text-primary-600 mt-2">
                    💡 {grupo.analisisOpenAI}
                  </p>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {expandedGroups.has(grupo.id) ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {expandedGroups.has(grupo.id) && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {grupo.productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="bg-gray-50 rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-500">
                            ID: {producto.id}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="font-semibold text-gray-700">
                            {producto.codigo}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="text-xs text-gray-500">
                            {producto.marca}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">
                          {producto.descripcion}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500">Similitud</div>
                        <div className="font-semibold text-primary-600">
                          {(producto.similitudConPrincipal * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}