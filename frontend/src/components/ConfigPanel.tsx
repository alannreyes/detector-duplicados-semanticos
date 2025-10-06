'use client';

import { SearchConfig } from '@/types';

interface ConfigPanelProps {
  config: SearchConfig;
  onConfigChange: (config: SearchConfig) => void;
}

export default function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  return (
    <div className="card sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        ⚙️ Configuración
      </h2>

      {/* Umbral de Similitud */}
      <div className="space-y-4">
        <div>
          <label className="label">
            Umbral de Similitud
          </label>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.umbral}
              onChange={(e) =>
                onConfigChange({ ...config, umbral: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.0</span>
              <span className="font-semibold text-primary-600 text-sm">
                {config.umbral.toFixed(2)}
              </span>
              <span>1.0</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Mayor valor = más estricto
          </p>
        </div>

        {/* OpenAI Toggle */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <label className="label mb-0">
              Validar con OpenAI
            </label>
            <button
              onClick={() =>
                onConfigChange({ ...config, usarOpenAI: !config.usarOpenAI })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.usarOpenAI ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.usarOpenAI ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Confirma duplicados con IA
          </p>
        </div>

        {/* OpenAI Level */}
        {config.usarOpenAI && (
          <div className="space-y-2 animate-fade-in">
            <label className="label">Nivel de Validación</label>
            <div className="space-y-2">
              {(['estricto', 'moderado', 'flexible'] as const).map((nivel) => (
                <label
                  key={nivel}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="nivelOpenAI"
                    value={nivel}
                    checked={config.nivelOpenAI === nivel}
                    onChange={() =>
                      onConfigChange({ ...config, nivelOpenAI: nivel })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {nivel}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-primary-800">
            <strong>Tip:</strong> Para mejores resultados, usa un umbral entre 0.70 y 0.85
          </p>
        </div>
      </div>
    </div>
  );
}