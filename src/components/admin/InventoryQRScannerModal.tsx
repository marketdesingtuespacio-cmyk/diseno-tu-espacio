import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  X,
  Camera,
  Upload,
  RefreshCw,
  Flashlight,
  ExternalLink,
  Package,
  Building2,
  Store,
  Globe,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Save,
  ScanLine,
  Lock
} from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface InventoryQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  onProductUpdated?: (updated: Product) => void;
}

export const InventoryQRScannerModal: React.FC<InventoryQRScannerModalProps> = ({
  isOpen,
  onClose,
  products = [],
  onProductUpdated
}) => {
  const { isAuthenticated, hasRole } = useAuth();
  const canScan = isAuthenticated && hasRole(['admin', 'collaborator']);

  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera');
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  // Scanned Product State
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Quick In-Situ Stock Adjustment State
  const [editWarehouseStock, setEditWarehouseStock] = useState<number>(0);
  const [editStoreStock, setEditStoreStock] = useState<number>(0);
  const [editWebStock, setEditWebStock] = useState<number>(0);
  const [isSavingStock, setIsSavingStock] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'inventory-qr-reader-region';

  // Pleasant auditory beep on successful scan
  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // AudioContext policy
    }
  };

  const vibratePhone = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // Ignored if unsupported
      }
    }
  };

  // Find product by parsed text (URL, SKU, ID, or slug)
  const resolveProductFromText = async (decodedText: string) => {
    setIsResolving(true);
    setScannerError(null);

    let query = decodedText.trim();

    // Check if it's a URL
    try {
      if (query.startsWith('http://') || query.startsWith('https://')) {
        const parsedUrl = new URL(query);
        const match = parsedUrl.pathname.match(/\/product\/([^/?#]+)/i);
        if (match && match[1]) {
          query = decodeURIComponent(match[1]);
        }
      }
    } catch {
      // Not a valid URL, treat as raw SKU / ID
    }

    // 1. Check in local products prop first
    const cleanLower = query.toLowerCase();
    let found = products.find(p => 
      p.id?.toLowerCase() === cleanLower ||
      p.sku?.toLowerCase() === cleanLower ||
      p.slug?.toLowerCase() === cleanLower
    );

    // 2. Fetch fresh real-time data from Supabase Cloud
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .or(`id.eq.${query},sku.ilike.${query},slug.ilike.${query}`)
          .limit(1);

        if (data && data.length > 0) {
          found = data[0] as Product;
        }
      } catch (err) {
        console.warn('Error consultando Supabase por QR:', err);
      }
    }

    setIsResolving(false);

    if (found) {
      playScanBeep();
      vibratePhone();
      setScannedProduct(found);
      setEditWarehouseStock(found.warehouse_stock ?? 0);
      setEditStoreStock(found.store_stock ?? 0);
      setEditWebStock(found.web_stock ?? 0);
      setSaveSuccessMessage(null);
      // Stop scanner while inspecting product
      stopScanner();
    } else {
      setScannerError(`No se encontró ningún producto con el código o enlace: "${query}"`);
    }
  };

  // Start live camera stream
  const startScanner = async () => {
    if (!canScan || !isOpen) return;
    setScannerError(null);
    setScannedProduct(null);

    try {
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch {
          // ignore
        }
      }

      const qrScanner = new Html5Qrcode(readerElementId);
      html5QrCodeRef.current = qrScanner;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await qrScanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          resolveProductFromText(decodedText);
        },
        () => {
          // Frame errors during scan are normal
        }
      );

      setIsScanning(true);

      // Check if torch/flashlight is supported
      try {
        const capabilities = qrScanner.getRunningTrackCapabilities();
        if (capabilities && (capabilities as any).torch) {
          setHasTorch(true);
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err: any) {
      console.error('Error al iniciar cámara para QR:', err);
      setIsScanning(false);
      setScannerError(
        'No se pudo acceder a la cámara. Asegúrate de otorgar permisos de cámara en tu navegador, o utiliza la opción de subir una foto del código.'
      );
    }
  };

  // Stop camera
  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error al detener cámara:', err);
      }
      setIsScanning(false);
      setIsTorchOn(false);
    }
  };

  // Handle uploading or snapping photo from phone gallery/shutter
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannerError(null);
    setIsResolving(true);

    try {
      let qrScanner = html5QrCodeRef.current;
      if (!qrScanner) {
        qrScanner = new Html5Qrcode(readerElementId);
        html5QrCodeRef.current = qrScanner;
      }

      const decodedText = await qrScanner.scanFile(file, true);
      await resolveProductFromText(decodedText);
    } catch (err) {
      console.warn('No se detectó QR en la foto:', err);
      setIsResolving(false);
      setScannerError('No se detectó un código QR nítido en la imagen seleccionada. Intenta con una toma más cercana o con mejor luz.');
    }
  };

  // Toggle mobile flashlight
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextTorch = !isTorchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch } as any]
      });
      setIsTorchOn(nextTorch);
    } catch (err) {
      console.warn('Error al activar linterna:', err);
    }
  };

  // Quick In-Situ Stock Update Handler
  const handleSaveStock = async () => {
    if (!scannedProduct) return;
    setIsSavingStock(true);
    setSaveSuccessMessage(null);

    const newW = Math.max(0, editWarehouseStock);
    const newS = Math.max(0, editStoreStock);
    const newB = Math.max(0, editWebStock);
    const newTotal = newW + newS + newB;

    let newStatus = scannedProduct.inventory_status || 'Disponible';
    if (newTotal > 3) newStatus = 'Disponible';
    else if (newTotal > 0 && newTotal <= 3) newStatus = 'Poco Stock';
    else newStatus = 'Agotado';

    try {
      const updated = await productService.updateProduct(scannedProduct.id, {
        warehouse_stock: newW,
        store_stock: newS,
        web_stock: newB,
        stock: newTotal,
        inventory_status: newStatus
      });

      if (updated) {
        setScannedProduct(updated);
        onProductUpdated?.(updated);
        setSaveSuccessMessage(`¡Stock actualizado con éxito! Total: ${newTotal} unidades.`);
      }
    } catch (err: any) {
      setScannerError(`Error guardando stock: ${err.message || 'Error inesperado'}`);
    } finally {
      setIsSavingStock(false);
    }
  };

  // Reset to scan next box
  const handleScanNext = () => {
    setScannedProduct(null);
    setScannerError(null);
    setSaveSuccessMessage(null);
    if (activeMode === 'camera') {
      startScanner();
    }
  };

  useEffect(() => {
    if (isOpen && canScan && activeMode === 'camera' && !scannedProduct) {
      const timer = setTimeout(() => {
        startScanner();
      }, 350);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
    return () => {
      stopScanner();
    };
  }, [isOpen, canScan, activeMode]);

  if (!isOpen) return null;

  const formatCOP = (val?: number) => {
    if (!val) return '$0 COP';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-neutral-950 text-white border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2">
                Escáner de Inventario
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black uppercase">
                  Físico
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-light">
                Escanea etiquetas físicas para auditar stock y ubicación
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50">
          
          {/* Permission Gate */}
          {!canScan ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-amber-950">
                Acceso Exclusivo para Equipo de Bodega & Ventas
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-light">
                Para escanear etiquetas de ruteo físico y modificar inventario debes haber iniciado sesión con una cuenta de <strong>Administrador</strong> o <strong>Colaborador</strong> autorizado.
              </p>
              <a
                href="/login"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-black transition-colors"
              >
                Iniciar Sesión
              </a>
            </div>
          ) : !scannedProduct ? (
            /* Mode Selector & Camera View */
            <div className="space-y-4">
              
              {/* Tab Selector: Live Camera vs Image Upload */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('camera');
                    setScannerError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeMode === 'camera'
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Cámara en Vivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('upload');
                    stopScanner();
                    setScannerError(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeMode === 'upload'
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto / Galería</span>
                </button>
              </div>

              {/* Live Camera Viewfinder */}
              {activeMode === 'camera' && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex flex-col items-center justify-center border-2 border-neutral-900 shadow-inner">
                  <div id={readerElementId} className="w-full h-full" />

                  {/* Animated Scanner Laser Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-56 h-56 border-2 border-amber-400/70 rounded-2xl relative shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                        {/* Target corner reticles */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400" />
                        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400" />
                        
                        {/* Animated Scan Line */}
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-bounce mt-24" />
                      </div>
                      <span className="mt-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-mono font-medium">
                        Apunta el código QR de la etiqueta
                      </span>
                    </div>
                  )}

                  {/* Camera Controls Overlay */}
                  {isScanning && (
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 pointer-events-auto">
                      {hasTorch && (
                        <button
                          type="button"
                          onClick={toggleTorch}
                          className={`p-2.5 rounded-full border backdrop-blur-md transition-all ${
                            isTorchOn
                              ? 'bg-amber-400 text-neutral-950 border-amber-300'
                              : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                          }`}
                          title="Linterna"
                        >
                          <Flashlight className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={startScanner}
                        className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reiniciar</span>
                      </button>
                    </div>
                  )}

                  {isResolving && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                      <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
                      <p className="text-xs font-mono font-bold tracking-wider">
                        Consultando producto y stock...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Image Mode */}
              {activeMode === 'upload' && (
                <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-8 text-center space-y-4 bg-white hover:border-neutral-400 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-700">
                    <Upload className="w-7 h-7 text-neutral-700" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900">
                      Selecciona una foto de la etiqueta
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Sube una foto tomada con tu celular o recibida por WhatsApp
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Tomar o Elegir Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileScan}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Error Callout */}
              {scannerError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-bold">Aviso del Escáner:</strong>
                    <p className="leading-snug">{scannerError}</p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Scanned Product Result & Real-Time Stock Inspector */
            <div className="space-y-4 animate-fade-in">
              
              {/* Product Badge Card */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex items-start gap-3.5">
                <img
                  src={
                    (scannedProduct.images && scannedProduct.images.length > 0)
                      ? scannedProduct.images[0]
                      : 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
                  }
                  alt={scannedProduct.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-neutral-200 bg-neutral-50 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded uppercase">
                      SKU: {scannedProduct.sku || scannedProduct.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-500">
                      {scannedProduct.category}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug line-clamp-2">
                    {scannedProduct.name}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm sm:text-base font-extrabold text-neutral-950 font-mono">
                      {formatCOP(scannedProduct.price)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      (IVA 19% incl.)
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Location Stocks Table / Controls */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-neutral-700" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Stock Físico por Ubicación
                    </h5>
                  </div>
                  <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    (editWarehouseStock + editStoreStock + editWebStock) > 3
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : (editWarehouseStock + editStoreStock + editWebStock) > 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    Total: {editWarehouseStock + editStoreStock + editWebStock} u.
                  </span>
                </div>

                <div className="space-y-2">
                  
                  {/* Bodega Principal */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">🏭 Bodega Principal</span>
                        <span className="text-[10px] text-neutral-500 font-mono">Almacenamiento Central</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditWarehouseStock(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm text-neutral-900">
                        {editWarehouseStock}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditWarehouseStock(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tienda Física */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">🏬 Tienda Showroom</span>
                        <span className="text-[10px] text-neutral-500 font-mono">Exhibición Laureles</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditStoreStock(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm text-neutral-900">
                        {editStoreStock}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditStoreStock(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Web */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">🌐 Despacho Web</span>
                        <span className="text-[10px] text-neutral-500 font-mono">Asignación Ecommerce</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditWebStock(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm text-neutral-900">
                        {editWebStock}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditWebStock(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Save In-Situ Stock Button */}
                <button
                  type="button"
                  disabled={isSavingStock}
                  onClick={handleSaveStock}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSavingStock ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Guardando en Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>Guardar Cambios de Stock</span>
                    </>
                  )}
                </button>

                {saveSuccessMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Scan Next or View Online */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleScanNext}
                  className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Escanear Otro</span>
                </button>

                <a
                  href={`/product/${scannedProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver en Tienda</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono text-[11px]">
            Lector QR Físico • Diseño Tu Espacio
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
