import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Palette, CheckCircle2, Sparkles, ArrowRight, Upload } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { useCurrency } from '../../context/CurrencyContext';

interface ProductRegistrationFormProps {
  onSuccess: () => void;
  initialProduct?: Product | null;
}

export const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({
  onSuccess,
  initialProduct
}) => {
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [brandCollection, setBrandCollection] = useState(initialProduct?.brand_collection || 'Diseño Tu Espacio Collection');
  const [category, setCategory] = useState(initialProduct?.category || 'Lámparas de Techo');
  const [style, setStyle] = useState(initialProduct?.style || 'Contemporáneo');
  const [price, setPrice] = useState<number>(initialProduct?.price || 890000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(initialProduct?.original_price || undefined);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 10);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProduct?.is_featured || false);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '160cm alto x 38cm diámetro');
  const [materials, setMaterials] = useState(initialProduct?.materials || 'Aluminio espejado, Acero satinado');

  // Media Gallery (1900 x 2375 px photos)
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0 
      ? initialProduct.images 
      : ['/images/lampara_bowie_1786563431628.jpg', '/images/bowie_lifestyle_1786565071854.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Color Swatches State
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    initialProduct?.colors || [
      { name: 'Latón Dorado', hex: '#CDB375' },
      { name: 'Plata Níquel', hex: '#D4D4D2' },
      { name: 'Negro Mate', hex: '#1C1C1C' }
    ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  // Add Image URL
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Helper: Client-side HTML5 Canvas Image Downscaling & Compression (~120KB Web-Ready)
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1400;
          const MAX_HEIGHT = 1750;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to lightweight high-quality Web-Ready JPEG (80% compression)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
            resolve(compressedDataUrl);
          } else {
            resolve(rawDataUrl);
          }
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Direct File Upload (Computer / Mobile device file picker)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida.`);
        continue;
      }

      try {
        const compressedBase64 = await compressAndResizeImage(file);
        setImages((prevImages) => [...prevImages, compressedBase64]);
      } catch (err) {
        console.warn('Error comprimiendo imagen:', err);
      }
    }

    // Reset input
    e.target.value = '';
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      alert('El producto debe tener al menos 1 imagen principal.');
    }
  };

  // Add Color Swatch
  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
      setNewColorHex('#000000');
    }
  };

  // Remove Color Swatch
  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Ingrese el nombre del producto.');
    
    setIsSubmitting(true);

    try {
      const baseSlug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const slug = initialProduct?.slug || (baseSlug.length > 0 ? baseSlug : `producto-${Date.now()}`);

      const productPayload: Omit<Product, 'id'> = {
        name: name.trim(),
        slug,
        brand_collection: brandCollection.trim(),
        category,
        style,
        price: Number(price),
        original_price: originalPrice && Number(originalPrice) > 0 ? Number(originalPrice) : undefined,
        stock: Number(stock),
        is_featured: isFeatured,
        description: description.trim(),
        dimensions: dimensions.trim(),
        materials: materials.trim(),
        images,
        colors
      };

      if (initialProduct?.id) {
        await productService.updateProduct(initialProduct.id, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }

      setIsSubmitting(false);
      setSuccessMessage(true);
      
      setTimeout(() => {
        setSuccessMessage(false);
        onSuccess();
      }, 1200);
    } catch (err: any) {
      console.error('Error guardando producto:', err);
      setIsSubmitting(false);
      alert(`Error al guardar el producto: ${err.message || 'Intente nuevamente'}`);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-4 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Back-office Manager • Alta de Productos
          </span>
          <h2 className="text-2xl font-light text-brand-black tracking-tight">
            {initialProduct ? 'Editar Ficha de Producto' : 'Registrar Nuevo Producto'}
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-brand-surface px-3 py-1.5 border border-brand-border text-neutral-600">
          <Sparkles className="w-3.5 h-3.5 text-brand-black" />
          <span>Medida Estándar: 1900 × 2375 PX</span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-900 text-white p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-subtle">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>¡Producto guardado exitosamente en el catálogo oficial!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: Informaciones Generales */}
        <div className="bg-white p-6 border border-brand-border space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            1. Información General del Producto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre Comercial *</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Lámpara de pie retro Walter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Línea / Colección</label>
              <input 
                type="text" 
                placeholder="Ej. Diseño Tu Espacio Collection"
                value={brandCollection}
                onChange={(e) => setBrandCollection(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Categoría *</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              >
                <option value="Lámparas de Techo">Lámparas de Techo</option>
                <option value="Iluminación de Pared">Iluminación de Pared</option>
                <option value="Lámparas de Pie">Lámparas de Pie</option>
                <option value="Lámparas de Mesa">Lámparas de Mesa</option>
                <option value="Diseño Mobiliario">Diseño Mobiliario</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Estilo Arquitectónico *</label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              >
                <option value="Contemporáneo">Contemporáneo</option>
                <option value="Minimalista">Minimalista</option>
                <option value="Bauhaus">Bauhaus</option>
                <option value="Nórdico">Nórdico</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-neutral-500 mb-1">Descripción Sobria & Editorial *</label>
              <textarea 
                rows={3}
                required
                placeholder="Describa la pieza en tono sobrio y elegante..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Precios & Inventario en COP */}
        <div className="bg-white p-6 border border-brand-border space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            2. Precios en Pesos Colombianos (COP) & Stock
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Precio Venta (COP) *</label>
              <input 
                type="number" 
                required
                min="0"
                step="10000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black focus:outline-none focus:border-brand-black text-sm"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">Vista Previa: {formatPrice(price)}</span>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Precio Original / Tachado (COP)</label>
              <input 
                type="number" 
                min="0"
                step="10000"
                placeholder="Opcional para descuentos"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Unidades en Inventario *</label>
              <input 
                type="number" 
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-brand-surface flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isFeaturedToggle"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-black w-4 h-4"
            />
            <label htmlFor="isFeaturedToggle" className="text-xs font-bold uppercase text-brand-black cursor-pointer">
              Destacar producto en la Portada Principal de la Tienda
            </label>
          </div>
        </div>

        {/* SECTION 3: Galería Fotográfica en Alta Resolución (1900 x 2375 px) */}
        <div className="bg-white p-6 border border-brand-border space-y-6">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 3. Galería de Fotos (Medida 1900 × 2375 PX)
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">Mínimo 1 foto de estudio + 1 foto in-situ</span>
          </div>

          {/* Image Upload & URL Row */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Direct File Picker Button (PC / Phone Gallery) */}
              <label className="cursor-pointer bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-subtle shrink-0">
                <Upload className="w-4 h-4 text-amber-300" />
                <span>📁 Seleccionar Fotos desde Mi Equipo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>

              {/* URL Input with Enter key handling */}
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  placeholder="o pegue la URL de la imagen en formato 1900 x 2375 px..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  className="flex-1 bg-brand-surface border border-brand-border p-2.5 text-xs focus:outline-none focus:border-brand-black"
                />
                <button 
                  type="button"
                  onClick={handleAddImage}
                  className="bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 hover:bg-black flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Agregar URL
                </button>
              </div>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono pt-1">
              <span>Fotografías de prueba de alta resolución:</span>
              <button 
                type="button"
                onClick={() => setImages(prev => [...prev, '/images/lampara_bowie_1786563431628.jpg'])}
                className="underline hover:text-black"
              >
                + Bowie Studio
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => setImages(prev => [...prev, '/images/lampara_walter_1786563440748.jpg'])}
                className="underline hover:text-black"
              >
                + Walter Chrome
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => setImages(prev => [...prev, '/images/plafon_lace_1786563458884.jpg'])}
                className="underline hover:text-black"
              >
                + Plafón Lace
              </button>
            </div>
          </div>

          {/* Images Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="group relative aspect-[1900/2375] bg-[#FAF9F6] border border-neutral-300 overflow-hidden">
                <img src={img} alt={`Vista ${idx+1}`} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5">
                  {idx === 0 ? 'FOTO PRINCIPAL' : `FOTO ${idx+1}`}
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 hover:bg-red-700 transition-colors"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Gestor de Muestras de Color / Acabados */}
        <div className="bg-white p-6 border border-brand-border space-y-6">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <Palette className="w-4 h-4" /> 4. Variantes de Acabado / Colores (Swatches)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Nombre del acabado (ej. Cromo Espejo, Latón Satinado)"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="flex-1 bg-brand-surface border border-brand-border p-2.5 text-xs focus:outline-none focus:border-brand-black"
            />
            <div className="flex items-center gap-2 border border-brand-border p-1.5 bg-brand-surface">
              <span className="text-[10px] font-bold uppercase text-neutral-500">Color:</span>
              <input 
                type="color" 
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-6 cursor-pointer bg-transparent"
              />
            </div>
            <button 
              type="button"
              onClick={handleAddColor}
              className="bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-neutral-800"
            >
              + Agregar Color
            </button>
          </div>

          {/* List of Swatches */}
          <div className="flex flex-wrap gap-3">
            {colors.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-brand-surface border border-brand-border p-2 text-xs">
                <span className="w-4 h-4 border border-neutral-400" style={{ backgroundColor: c.hex }} />
                <span className="font-medium text-brand-black">{c.name}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveColor(idx)}
                  className="text-neutral-400 hover:text-red-600 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Especificaciones Técnicas */}
        <div className="bg-white p-6 border border-brand-border space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            5. Especificaciones & Materiales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Dimensiones Exactas</label>
              <input 
                type="text" 
                placeholder="Ej. 160cm alto x 38cm diámetro base"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Materiales Principales</label>
              <input 
                type="text" 
                placeholder="Ej. Aluminio cromo espejado, Acero pesado"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4 pt-4 border-t border-brand-border">
          <button 
            type="button"
            onClick={onSuccess}
            className="bg-transparent border border-brand-black text-brand-black text-xs font-bold uppercase tracking-widest py-4 px-8 hover:bg-neutral-100"
          >
            Cancelar
          </button>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-4 px-10 hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-elevated"
          >
            {isSubmitting ? 'Guardando en Catálogo...' : (
              <>
                <span>Guardar Producto Oficial</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
