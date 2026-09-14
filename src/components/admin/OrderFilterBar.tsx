import React from 'react';
import { 
  Search, 
  Calendar, 
  Truck, 
  CreditCard, 
  Clock, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

export interface OrderFilterState {
  searchQuery: string;
  status: 'all' | Order['status'];
  carrier: string;
  paymentGateway: string;
  customerTag: string;
  dateRange: 'all' | 'today' | '7days' | '30days' | 'custom';
  startDate: string;
  endDate: string;
}

interface OrderFilterBarProps {
  filters: OrderFilterState;
  onFilterChange: (filters: OrderFilterState) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  filteredTotalCOP: number;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
  filteredTotalCOP
}) => {
  const { formatPrice } = useCurrency();

  const handleUpdate = (field: keyof OrderFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.status !== 'all' ||
    filters.carrier !== 'all' ||
    filters.paymentGateway !== 'all' ||
    filters.customerTag !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '';

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/90 p-5 rounded-2xl shadow-xs space-y-4 text-xs font-sans">
      
      {/* Title & Stats Summary Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-900 text-white rounded-xl shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
              Filtros Inteligentes & Búsqueda Avanzada
            </h4>
            <p className="text-[10px] text-neutral-500 font-medium">
              Filtra por fecha, estado de entrega, pasarela de pago, transportadora o perfil de cliente.
            </p>
          </div>
        </div>

        {/* Counter and Total Sum Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold rounded-full text-[10px]">
            {filteredCount} de {totalCount} pedidos
          </span>

          <span className="px-3 py-1 bg-neutral-900 text-white font-extrabold rounded-full text-[10px] shadow-2xs">
            Sumatoria: {formatPrice(filteredTotalCOP)}
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

      {/* Filters Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* 1. Global Search Box */}
        <div className="lg:col-span-2 relative">
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1">
            Buscador Global
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Ref, cliente, guía, teléfono..."
              value={filters.searchQuery}
              onChange={(e) => handleUpdate('searchQuery', e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
            />
          </div>
        </div>

        {/* 2. Status Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-500" /> Estado de Envío
          </label>
          <select 
            value={filters.status}
            onChange={(e) => handleUpdate('status', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes por Verificar</option>
            <option value="processing">En Preparación / Taller</option>
            <option value="shipped">Despachados / En Tránsito</option>
            <option value="delivered">Entregados / Posventa</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>

        {/* 3. Carrier Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Truck className="w-3 h-3 text-neutral-500" /> Transportadora
          </label>
          <select 
            value={filters.carrier}
            onChange={(e) => handleUpdate('carrier', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Todas las Empresas</option>
            <option value="Servientrega">Servientrega</option>
            <option value="Interrapidísimo">Interrapidísimo</option>
            <option value="Deprisa / Avianca">Deprisa / Avianca</option>
            <option value="Flete Privado Luxe">Flete Privado Luxe</option>
            <option value="Retiro en Showroom">Retiro en Showroom</option>
          </select>
        </div>

        {/* 4. Payment Gateway Filter */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-neutral-500" /> Método de Pago
          </label>
          <select 
            value={filters.paymentGateway}
            onChange={(e) => handleUpdate('paymentGateway', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Todas las Pasarelas</option>
            <option value="Transferencia Directa Bancaria">Transferencia Bancaria</option>
            <option value="Wompi Colombia">Wompi Colombia (TC/PSE)</option>
            <option value="Mercado Pago">Mercado Pago</option>
            <option value="Efectivo en Showroom">Efectivo Showroom</option>
          </select>
        </div>

        {/* 5. Date Range Selector */}
        <div>
          <label className="block uppercase font-bold text-neutral-400 text-[9px] tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-500" /> Período / Fecha
          </label>
          <select 
            value={filters.dateRange}
            onChange={(e) => handleUpdate('dateRange', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          >
            <option value="all">Histórico Completo</option>
            <option value="today">Registrados Hoy</option>
            <option value="7days">Últimos 7 Días</option>
            <option value="30days">Últimos 30 Días</option>
            <option value="custom">Rango Personalizado</option>
          </select>
        </div>

      </div>

      {/* Custom Date Pickers (if 'custom' is selected) */}
      {filters.dateRange === 'custom' && (
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 animate-fadeIn">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Rango de Fecha:</span>
          
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
