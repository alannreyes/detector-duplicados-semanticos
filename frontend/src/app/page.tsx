'use client';

import { useState } from 'react';
import ConfigPanel from '@/components/ConfigPanel';
import SearchTabs from '@/components/SearchTabs';
import ResultsDisplay from '@/components/ResultsDisplay';
import StatsCard from '@/components/StatsCard';
import { SearchConfig, SearchResult } from '@/types';

export default function Home() {
  const [config, setConfig] = useState<SearchConfig>({
    umbral: 0.75,
    usarOpenAI: false,
    nivelOpenAI: 'moderado',
  });

  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (newResults: SearchResult) => {
    setResults(newResults);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Productos"
          value="10,543"
          icon="📦"
          trend="+12%"
          color="green"
        />
        <StatsCard
          title="Duplicados Detectados"
          value="1,234"
          icon="🔄"
          trend="-5%"
          color="yellow"
        />
        <StatsCard
          title="Ahorro Potencial"
          value="$45,320"
          icon="💰"
          trend="+18%"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <ConfigPanel config={config} onConfigChange={setConfig} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Search Tabs */}
          <SearchTabs
            config={config}
            onSearch={handleSearch}
            setLoading={setLoading}
          />

          {/* Results */}
          {loading && (
            <div className="card">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            </div>
          )}

          {!loading && results && (
            <ResultsDisplay results={results} />
          )}
        </div>
      </div>
    </div>
  );
}