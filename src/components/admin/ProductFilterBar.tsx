import React from 'react';
import { 
  Search, 
  Calendar, 
  Layers, 
  PackageCheck, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  inventoryStatus: 'all' | 'Privado' | 'Disponible' | 'Poco Stock' | 'Agotado';
  dateRange: 'all' | 'today' | '7days' | '30days' | 'custom';
  startDate: string;
  endDate: string;
}

interface ProductFilterBarProps {
  filters: ProductFilterState;
  onFilterChange: (filters: ProductFilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  categories: string[];
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
  categories
}) => {
  const handleUpdate = (field: keyof ProductFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.inventoryStatus !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '';

  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/90 p-5 rounded-2xl shadow-xs space-y-4 text-xs font-sans">
      
      {/* Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-900 text-white rounded-xl shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
              Filtros Inteligentes de Inventario & Catálogo
            </h4>
            <p className="text-[10px] text-neutral-500 font-medium">
              Filtra por categorías, productos privados, disponibles, por agotarse, agotados o fecha de ingreso.
            </p>
          </div>
        </div>

        {/* Counter & Clear Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold rounded-full text-[10px]">
            Mostrando {filteredCount} de {totalCount} productos
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-full text-[10px] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        
        {/* 1. Search Input */}
        <div className="lg:col-span-2 relative">
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1">
            Buscador por Nombre, SKU o Material
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Buscar por SKU (ej. MD680101, SF021), nombre..."
              value={filters.searchQuery}
              onChange={(e) => handleUpdate('searchQuery', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
            />
          </div>
        </div>

        {/* 2. Category Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-neutral-500" /> Categorías
          </label>
          <select 
            value={filters.category}
            onChange={(e) => handleUpdate('category', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 3. Inventory Status Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <PackageCheck className="w-3 h-3 text-neutral-500" /> Estado de Inventario
          </label>
          <select 
            value={filters.inventoryStatus}
            onChange={(e) => handleUpdate('inventoryStatus', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Todos los Estados</option>
            <option value="Privado">🔒 Privados</option>
            <option value="Disponible">✅ Disponibles (Stock Normal)</option>
            <option value="Poco Stock">⚠️ Por Agotarse (1 - 3 unidades)</option>
            <option value="Agotado">❌ Agotados (0 unidades)</option>
          </select>
        </div>

        {/* 4. Date Range Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-500" /> Fecha de Ingreso
          </label>
          <select 
            value={filters.dateRange}
            onChange={(e) => handleUpdate('dateRange', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Histórico Completo</option>
            <option value="today">Ingresados Hoy</option>
            <option value="7days">Últimos 7 Días</option>
            <option value="30days">Últimos 30 Días</option>
            <option value="custom">Rango Personalizado</option>
          </select>
        </div>

      </div>

      {/* Custom Date Range Pickers (if 'custom' is selected) */}
      {filters.dateRange === 'custom' && (
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 animate-fadeIn">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Fecha de Ingreso:</span>
          
          <div className="flex items-center gap-2">
            <label className="text-[9.5px] font-semibold text-neutral-400">Desde:</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => handleUpdate('startDate', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-1 font-bold text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[9.5px] font-semibold text-neutral-400">Hasta:</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => handleUpdate('endDate', e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-1 font-bold text-xs"
            />
          </div>
        </div>
      )}

    </div>
  );
};
