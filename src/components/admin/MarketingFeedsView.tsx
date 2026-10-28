import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles,
  HelpCircle,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

interface MarketingFeedsViewProps {
  products?: Product[];
}

export const MarketingFeedsView: React.FC<MarketingFeedsViewProps> = ({ products: initialProducts }) => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts || []);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductsList(initialProducts);
    } else {
      productService.getProducts().then(res => {
        if (res) setProductsList(res);
      });
    }
  }, [initialProducts]);

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://disenotuespacio.com';

  const googleXmlUrl = `${siteOrigin}/api/feeds/google-shopping.xml`;
  const googleXmlStaticUrl = `${siteOrigin}/feeds/google-shopping.xml`;
  const metaCsvUrl = `${siteOrigin}/api/feeds/meta-catalog.csv`;
  const metaCsvStaticUrl = `${siteOrigin}/feeds/meta-catalog.csv`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const validProductsCount = productsList.filter((p: Product) => Number(p.price) > 0).length;
  const inStockCount = productsList.filter((p: Product) => (p.stock || 0) > 0 && p.inventory_status !== 'Agotado').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-neutral-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" /> Pauta Digital & Sincronización de Catálogos
          </div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
            Catálogos para Meta Business (Facebook/Instagram) & Google Shopping
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Sincroniza automáticamente todo el inventario de <strong>Diseño Tu Espacio</strong> con Meta Commerce Manager y Google Merchant Center mediante Data Feeds en tiempo real. Configura campañas Advantage+ y anuncios dinámicos de retargeting sin subir productos a mano.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800 mt-6">
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Productos Listados</span>
            <span className="text-lg font-bold text-white font-mono">{validProductsCount}</span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Disponibles con Stock</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{inStockCount}</span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Meta Pixel</span>
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1122204456999990
            </span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Google Analytics / Tag</span>
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> G-GCG3E204JM
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Meta Business & Google Shopping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 1: META BUSINESS & INSTAGRAM ADS */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base">Meta Business & Instagram Ads</h3>
                  <p className="text-[11px] text-neutral-500">Catálogo dinámico para anuncios en Facebook e Instagram</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Commerce Manager
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                  1. URL del Feed Oficial (XML compatible con Meta):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={googleXmlUrl}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(googleXmlUrl, 'meta-xml')}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'meta-xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'meta-xml' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                  2. URL Alternativa en formato CSV:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={metaCsvUrl}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(metaCsvUrl, 'meta-csv')}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-neutral-200"
                  >
                    {copiedKey === 'meta-csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'meta-csv' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={metaCsvStaticUrl}
                download="meta-catalog-disenotuespacio.csv"
                className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[11px] font-bold text-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" /> Descargar CSV
              </a>
              <a
                href="https://business.facebook.com/commerce_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                Abrir Meta Commerce Manager <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Guide Step-by-Step */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-950 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-blue-900">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Pasos para configurar en Meta:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-900/90 leading-relaxed pl-1">
                <li>Ve a <strong>business.facebook.com/commerce_manager</strong> y selecciona tu empresa.</li>
                <li>En el menú lateral, haz clic en <strong>Catálogo &gt; Orígenes de datos</strong>.</li>
                <li>Selecciona <strong>Data feed (Lista de datos)</strong> y haz clic en <em>Siguiente</em>.</li>
                <li>Elige <strong>Subida programada</strong> y pega la URL del feed XML o CSV copiada arriba.</li>
                <li>Establece la frecuencia de sincronización en <strong>Diaria</strong> o <strong>Cada hora</strong>.</li>
                <li>Selecciona la moneda: <strong>COP (Peso Colombiano)</strong>.</li>
                <li>En <em>Eventos</em>, conecta el Pixel <strong>1122204456999990</strong> para habilitar retargeting dinámico.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* CARD 2: GOOGLE SHOPPING / MERCHANT CENTER */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base">Google Shopping</h3>
                  <p className="text-[11px] text-neutral-500">Google Merchant Center & Campañas de Máximo Rendimiento (PMax)</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Merchant Center
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                  URL del Feed RSS / XML para Google Merchant Center:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={googleXmlUrl}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(googleXmlUrl, 'google-xml')}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'google-xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'google-xml' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block mb-1">
                  URL de respaldo estático (Cloudflare Pages):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={googleXmlStaticUrl}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(googleXmlStaticUrl, 'google-static')}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-neutral-200"
                  >
                    {copiedKey === 'google-static' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'google-static' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={googleXmlStaticUrl}
                download="google-shopping-disenotuespacio.xml"
                className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[11px] font-bold text-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" /> Descargar XML
              </a>
              <a
                href="https://merchants.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                Abrir Google Merchant Center <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Guide Step-by-Step */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-950 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Pasos para configurar en Google:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900/90 leading-relaxed pl-1">
                <li>Ingresa a <strong>merchants.google.com</strong> con la cuenta de Google de la empresa.</li>
                <li>Ve a <strong>Productos &gt; Feeds</strong> y haz clic en el botón <strong>+ (Agregar feed)</strong>.</li>
                <li>Configura el país de destino: <strong>Colombia</strong> e idioma: <strong>Español</strong>.</li>
                <li>Selecciona el método de entrada: <strong>Recuperación programada (Scheduled Fetch)</strong>.</li>
                <li>Pega la URL del feed XML copiada arriba y ponle frecuencia diaria (ej. 02:00 AM).</li>
                <li>Google procesará los productos y los sincronizará de inmediato con <strong>Google Shopping</strong> y tus campañas de <strong>Google Ads</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Technical Details Accordion / Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Especificaciones Técnicas de los Feeds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-neutral-600">
          <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-neutral-700" /> Taxonomía Oficial de Google
            </span>
            <p className="text-[11px] text-neutral-500">
              Categorización automática para Espejos (Mirrors), Cuadros (Artwork), Lavamanos (Bathroom Sinks) y Decoración.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-700" /> Tracking de Eventos (Pixel & GA4)
            </span>
            <p className="text-[11px] text-neutral-500">
              Los eventos ViewContent, AddToCart, InitiateCheckout y Purchase envían el SKU exacto de cada producto para remarketing dinámico.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-bold text-neutral-800 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" /> Actualización Automática
            </span>
            <p className="text-[11px] text-neutral-500">
              Cualquier cambio de precio o stock en Supabase se refleja de forma instantánea al consultar el endpoint <code>/api/feeds/google-shopping.xml</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
