'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { MagnifyingGlassIcon, ChartBarIcon, FolderIcon } from '@heroicons/react/24/outline';
import { SearchConfig, SearchResult } from '@/types';
import { searchByDescription, searchByRange, searchByCategory } from '@/services/api';
import toast from 'react-hot-toast';

interface SearchTabsProps {
  config: SearchConfig;
  onSearch: (results: SearchResult) => void;
  setLoading: (loading: boolean) => void;
}

export default function SearchTabs({ config, onSearch, setLoading }: SearchTabsProps) {
  const [descripcion, setDescripcion] = useState('');
  const [rangoDesde, setRangoDesde] = useState('');
  const [rangoHasta, setRangoHasta] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSearchIndividual = async () => {
    if (!descripcion.trim()) {
      toast.error('Por favor ingresa una descripción');
      return;
    }

    setLoading(true);
    try {
      const results = await searchByDescription({
        descripcion,
        ...config,
      });
      onSearch(results);
      toast.success('Búsqueda completada');
    } catch (error) {
      toast.error('Error al buscar duplicados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRange = async () => {
    if (!rangoDesde || !rangoHasta) {
      toast.error('Por favor completa el rango de IDs');
      return;
    }

    setLoading(true);
    try {
      const results = await searchByRange({
        desdeId: parseInt(rangoDesde),
        hastaId: parseInt(rangoHasta),
        ...config,
      });
      onSearch(results);
      toast.success('Búsqueda por rango completada');
    } catch (error) {
      toast.error('Error al buscar duplicados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCategory = async () => {
    if (!categoria.trim()) {
      toast.error('Por favor selecciona una categoría');
      return;
    }

    setLoading(true);
    try {
      const results = await searchByCategory({
        categoria,
        ...config,
      });
      onSearch(results);
      toast.success('Búsqueda por categoría completada');
    } catch (error) {
      toast.error('Error al buscar duplicados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
              ${
                selected
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Búsqueda Individual</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
              ${
                selected
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <ChartBarIcon className="h-4 w-4" />
              <span>Búsqueda por Rango</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
              ${
                selected
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <FolderIcon className="h-4 w-4" />
              <span>Por Categoría</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Individual Search */}
          <Tab.Panel className="space-y-4">
            <div>
              <label className="label">Descripción del Producto</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Ej: computadora portatil lenovo t41 gen 4 32gb ram 500mb disco"
              />
            </div>
            <button
              onClick={handleSearchIndividual}
              className="btn-primary w-full"
            >
              🔍 Buscar Duplicados
            </button>
          </Tab.Panel>

          {/* Range Search */}
          <Tab.Panel className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">ID Desde</label>
                <input
                  type="number"
                  value={rangoDesde}
                  onChange={(e) => setRangoDesde(e.target.value)}
                  className="input"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="label">ID Hasta</label>
                <input
                  type="number"
                  value={rangoHasta}
                  onChange={(e) => setRangoHasta(e.target.value)}
                  className="input"
                  placeholder="2000"
                />
              </div>
            </div>
            <button
              onClick={handleSearchRange}
              className="btn-primary w-full"
            >
              ▶️ Procesar Rango
            </button>
          </Tab.Panel>

          {/* Category Search */}
          <Tab.Panel className="space-y-4">
            <div>
              <label className="label">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="input"
              >
                <option value="">Seleccionar categoría</option>
                <option value="21">21 - Equipamiento</option>
                <option value="42">42 - Mobiliario</option>
                <option value="11">11 - Computación</option>
                <option value="15">15 - Electrónica</option>
              </select>
            </div>
            <button
              onClick={handleSearchCategory}
              className="btn-primary w-full"
            >
              📁 Buscar en Categoría
            </button>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}