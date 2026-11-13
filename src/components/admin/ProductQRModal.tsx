import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  PackageCheck,
} from 'lucide-react';
import { Product } from '../../types';

interface ProductQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  products?: Product[];
}

export const ProductQRModal: React.FC<ProductQRModalProps> = ({
  isOpen,
  onClose,
  product,
  products = [],
}) => {
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const itemsToRender: Product[] = product
    ? [product]
    : products.length > 0
    ? products
    : [];

  useEffect(() => {
    if (!isOpen || itemsToRender.length === 0) return;

    let isMounted = true;
    const origin = window.location.origin;

    const generateAll = async () => {
      const newMap: Record<string, string> = {};
      for (const item of itemsToRender) {
        try {
          const productUrl = `${origin}/product/${item.id}`;
          const dataUrl = await QRCode.toDataURL(productUrl, {
            width: 320,
            margin: 1.5,
            errorCorrectionLevel: 'H',
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
          });
          newMap[item.id] = dataUrl;
        } catch (err) {
          console.error('Error generando QR para producto:', item.id, err);
        }
      }
      if (isMounted) {
        setQrMap(newMap);
      }
    };

    generateAll();

    return () => {
      isMounted = false;
    };
  }, [isOpen, itemsToRender.length]);

  if (!isOpen || itemsToRender.length === 0) return null;

  const formatCOP = (val?: number) => {
    if (!val) return '$0 COP';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = (prod: Product) => {
    const dataUrl = qrMap[prod.id];
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QR-${prod.sku || prod.slug || prod.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async (prod: Product) => {
    const url = `${window.location.origin}/product/${prod.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(prod.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error al copiar enlace:', err);
    }
  };

  const isMultiple = itemsToRender.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* PRINT-ONLY STYLES: Optimizado para etiquetas adhesivas físicas (10cm x 6cm o térmicas) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area-qr-labels, #print-area-qr-labels * {
            visibility: visible;
          }
          #print-area-qr-labels {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }
          .print-label-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 12mm;
            border: 1.5px solid #000 !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                Ruteo Físico & Etiquetas QR
                {isMultiple && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-bold">
                    {itemsToRender.length} Productos
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-300 font-light">
                Generación automática de códigos para etiquetado en bodega, showroom y despacho.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {isMultiple ? `Todas (${itemsToRender.length})` : 'Etiqueta'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50/70 space-y-6">
          
          {/* Print Container ID */}
          <div id="print-area-qr-labels" className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {itemsToRender.map((item) => {
              const qrImage = qrMap[item.id];
              const wStock = item.warehouse_stock ?? 0;
              const sStock = item.store_stock ?? 0;
              const bStock = item.web_stock ?? 0;
              const totalStock = wStock + sStock + bStock > 0 ? wStock + sStock + bStock : item.stock;

              return (
                <div
                  key={item.id}
                  className="print-label-item bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 text-neutral-900"
                >
                  {/* Top Branding & SKU Bar */}
                  <div className="flex items-start justify-between border-b border-neutral-200 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.25em] text-neutral-500 block">
                        DISEÑO TU ESPACIO
                      </span>
                      <span className="text-[11px] font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 mt-0.5 inline-block">
                        SKU: {item.sku || 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-neutral-950 font-mono">
                        {formatCOP(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Center: QR Code + Product Meta */}
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 bg-white border border-neutral-200 rounded-lg p-1.5 flex items-center justify-center shadow-2xs">
                      {qrImage ? (
                        <img
                          src={qrImage}
                          alt={`QR ${item.name}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="animate-pulse text-xs text-neutral-400 font-mono">
                          Generando QR...
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2 text-left">
                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Physical Location Stocks for Routing */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Ruteo de Inventario Físico:
                        </span>
                        <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
                          <div className="bg-neutral-50 border border-neutral-200 rounded p-1 text-center">
                            <span className="text-[9px] text-neutral-500 block">🏭 BODEGA</span>
                            <strong className="text-neutral-900">{wStock} u.</strong>
                          </div>
                          <div className="bg-neutral-50 border border-neutral-200 rounded p-1 text-center">
                            <span className="text-[9px] text-neutral-500 block">🏬 TIENDA</span>
                            <strong className="text-neutral-900">{sStock} u.</strong>
                          </div>
                          <div className="bg-neutral-50 border border-neutral-200 rounded p-1 text-center">
                            <span className="text-[9px] text-neutral-500 block">🌐 WEB</span>
                            <strong className="text-neutral-900">{bStock} u.</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>Garantía: {item.warranty || '3 años'}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Total: {totalStock} u.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Quick Actions (Hidden in Print) */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 print:hidden">
                    <button
                      type="button"
                      onClick={() => handleDownloadQR(item)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium transition-colors"
                      title="Descargar imagen PNG del QR"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium transition-colors"
                      title="Copiar URL directa al portapapeles"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`/product/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-medium transition-colors ml-auto"
                    >
                      <span>Ver Ficha</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logistics Guidance Tip Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3 print:hidden">
            <PackageCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">
                Instrucciones para Ruteo y Rotulado Físico:
              </strong>
              <p className="text-amber-900 leading-relaxed font-light">
                Al imprimir, cada etiqueta física incluye el <strong>código QR de alta definición</strong>, el <strong>SKU</strong>, nombre y cantidades asignadas a Bodega y Tienda. Al escanear el QR con cualquier teléfono móvil o lector de inventario, se abrirá al instante la ficha pública del producto en la web para consultar stock y despachar pedidos.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            URL Base: <code className="font-mono text-neutral-800">{window.location.origin}/product/[id]</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir Etiquetas Físicas</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
