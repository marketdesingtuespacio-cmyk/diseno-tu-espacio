import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Palette, CheckCircle2, Sparkles, ArrowRight, Upload, ChevronLeft, ChevronRight, Star, GripVertical } from 'lucide-react';
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

  // Base & Extended Inventory Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [brandCollection, setBrandCollection] = useState(initialProduct?.brand_collection || 'Diseño Tu Espacio Collection');
  const [category, setCategory] = useState(initialProduct?.category || 'Papel de Colgadura');
  const [style, setStyle] = useState(initialProduct?.style || 'Contemporáneo');
  const [price, setPrice] = useState<number>(initialProduct?.price || 890000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(initialProduct?.original_price || undefined);
  const [wholesalePrice, setWholesalePrice] = useState<number | undefined>(initialProduct?.wholesale_price || undefined);
  const [wholesaleMinQty, setWholesaleMinQty] = useState<number>(initialProduct?.wholesale_min_qty || 5);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 10);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProduct?.is_featured || false);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '160cm alto x 38cm diámetro');
  const [materials, setMaterials] = useState(initialProduct?.materials || 'Aluminio espejado, Acero satinado');

  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [warehouseStock, setWarehouseStock] = useState<number>(initialProduct?.warehouse_stock || 0);
  const [storeStock, setStoreStock] = useState<number>(initialProduct?.store_stock || 0);
  const [webStock, setWebStock] = useState<number>(initialProduct?.web_stock || 0);
  const [boxesCount, setBoxesCount] = useState<number>(initialProduct?.boxes_count || 0);
  const [warranty, setWarranty] = useState(initialProduct?.warranty || '3 años');
  const [inventoryStatus, setInventoryStatus] = useState(initialProduct?.inventory_status || 'Disponible');
  const [shippingReturnsInfo, setShippingReturnsInfo] = useState(initialProduct?.shipping_returns_info || '');
  const [careInstructions, setCareInstructions] = useState(initialProduct?.care_instructions || '');
  const [fastShippingBadge, setFastShippingBadge] = useState(initialProduct?.fast_shipping_badge || '');
  const [returnsPolicyBadge, setReturnsPolicyBadge] = useState(initialProduct?.returns_policy_badge || '');

  // Media Gallery (1900 x 2375 px photos)
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0 
      ? initialProduct.images 
      : []
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
  const handleAddImage = async () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('data:image/')) {
      setIsUploadingImage(true);
      try {
        const publicUrl = await productService.uploadProductImage(trimmed, name || 'producto');
        if (publicUrl && !publicUrl.startsWith('data:image/')) {
          setImages(prev => [...prev, publicUrl]);
          setNewImageUrl('');
        }
      } catch (err: any) {
        alert(`⚠️ NO SE PUDO SUBIR LA IMAGEN A SUPABASE STORAGE.\n\nMotivo: ${err?.message || 'Bucket no disponible'}\n\nPara no agotar el espacio de tu base de datos gratuita con texto Base64, debes ejecutar el script SQL create_storage_bucket.sql en el Editor SQL de tu panel de Supabase.`);
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      setImages(prev => [...prev, trimmed]);
      setNewImageUrl('');
    }
  };

  // Helper: Client-side HTML5 Canvas Image Downscaling & Compression (~45KB Web-Ready)
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 640;
          const MAX_HEIGHT = 800;
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
            // Convert to lightweight Web-Ready JPEG (58% quality for minimal payload)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.58);
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

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Handle Direct File Upload (Computer / Mobile device file picker -> Supabase Storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploadingImage(true);
    
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida.`);
        continue;
      }

      try {
        const compressedBase64 = await compressAndResizeImage(file);
        // Upload directly to Supabase Storage product-images bucket
        const publicUrl = await productService.uploadProductImage(compressedBase64, name || 'producto');
        if (publicUrl && !publicUrl.startsWith('data:image/')) {
          setImages((prevImages) => [...prevImages, publicUrl]);
        }
      } catch (err: any) {
        console.error('Error procesando imagen para Supabase Storage:', err);
        alert(`⚠️ NO SE PUDO SUBIR LA IMAGEN A SUPABASE STORAGE.\n\n${err?.message || 'Error al conectar con Supabase Storage'}\n\nPara proteger la cuota gratuita de tu base de datos y no saturarla con imágenes Base64, por favor ejecuta el archivo SQL create_storage_bucket.sql en el Editor SQL de Supabase para habilitar el bucket product-images.`);
        break;
      }
    }

    setIsUploadingImage(false);
    // Reset input
    e.target.value = '';
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Move Image Left / Right
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);
    setImages(newImages);
  };

  // Set image as main cover (Position 0)
  const handleSetMainImage = (index: number) => {
    if (index === 0 || index >= images.length) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setImages(newImages);
  };

  // Drag and drop handlers for image cards
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;
    const newImages = [...images];
    const [dragged] = newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, dragged);
    setImages(newImages);
    setDraggedImageIndex(null);
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
        wholesale_price: wholesalePrice && Number(wholesalePrice) > 0 ? Number(wholesalePrice) : undefined,
        wholesale_min_qty: Number(wholesaleMinQty) || 5,
        stock: Number(stock),
        is_featured: isFeatured,
        description: description.trim(),
        dimensions: dimensions.trim(),
        materials: materials.trim(),
        images,
        colors,
        sku: sku.trim(),
        warehouse_stock: Number(warehouseStock),
        store_stock: Number(storeStock),
        web_stock: Number(webStock),
        boxes_count: Number(boxesCount),
        warranty: warranty.trim(),
        inventory_status: inventoryStatus.trim(),
        shipping_returns_info: shippingReturnsInfo.trim(),
        care_instructions: careInstructions.trim(),
        fast_shipping_badge: fastShippingBadge.trim(),
        returns_policy_badge: returnsPolicyBadge.trim()
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
    <div className="space-y-6 sm:space-y-8 font-sans max-w-5xl">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-3 sm:pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Back-office Manager • Alta de Productos
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-brand-black tracking-tight">
            {initialProduct ? 'Editar Ficha de Producto' : 'Registrar Nuevo Producto'}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono bg-brand-surface px-2.5 sm:px-3 py-1.5 border border-brand-border text-neutral-600">
          <Sparkles className="w-3.5 h-3.5 text-brand-black shrink-0" />
          <span>Medida Estándar: 1900 × 2375 PX</span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-900 text-white p-3.5 sm:p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-subtle">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>¡Producto guardado exitosamente en el catálogo oficial!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: Informaciones Generales */}
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            1. Información General del Producto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
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
              <label className="block uppercase font-bold text-neutral-500 mb-1">Referencia / Código SKU</label>
              <input 
                type="text" 
                placeholder="Ej. A585A-P01M o MD680101"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Categoría *</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              >
                <option value="Papel de Colgadura">Papel de Colgadura</option>
                <option value="Lavamanos">Lavamanos</option>
                <option value="Espejos">Espejos</option>
                <option value="Cuadros">Cuadros</option>
                <option value="Revestimientos">Revestimientos</option>
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
                <option value="Orgánico Moderno">Orgánico Moderno</option>
                <option value="Galería Contemporánea">Galería Contemporánea</option>
                <option value="Arquitectónico">Arquitectónico</option>
                <option value="Bauhaus">Bauhaus</option>
                <option value="Nórdico">Nórdico</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Garantía del Fabricante</label>
              <input 
                type="text" 
                placeholder="Ej. 5 años, 10 años"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="block uppercase font-bold text-neutral-500 mb-1">Estado de Inventario</label>
              <select 
                value={inventoryStatus}
                onChange={(e) => setInventoryStatus(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              >
                <option value="Disponible">Disponible</option>
                <option value="Privado">Privado</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>

            <div className="sm:col-span-2">
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

        {/* SECTION 2: Precios & Inventario por Ubicación en COP */}
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            2. Precios en Pesos Colombianos (COP) & Desglose de Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Precio de Venta / Oferta (COP) *</label>
              <input 
                type="number" 
                required
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black focus:outline-none focus:border-brand-black text-sm"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">Precio a Cobrar: {formatPrice(price)}</span>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Precio Regular Original (Tachado)</label>
              <input 
                type="number" 
                min="0"
                step="any"
                placeholder="Ej. 900000"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-emerald-800 mb-1">Precio al Por Mayor (COP)</label>
              <input 
                type="number" 
                min="0"
                step="any"
                placeholder="Ej. 730000"
                value={wholesalePrice || ''}
                onChange={(e) => setWholesalePrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-emerald-50/50 border border-emerald-300 p-3 font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-emerald-700 mt-1 block">
                {wholesalePrice ? `Por Mayor: ${formatPrice(wholesalePrice)}` : 'Opcional'}
              </span>
            </div>

            <div>
              <label className="block uppercase font-bold text-emerald-800 mb-1">Cant. Mínima por Mayor</label>
              <input 
                type="number" 
                min="1"
                placeholder="Ej. 5 cajas / unidades"
                value={wholesaleMinQty}
                onChange={(e) => setWholesaleMinQty(Number(e.target.value))}
                className="w-full bg-emerald-50/50 border border-emerald-300 p-3 font-medium text-emerald-900 focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-emerald-700 mt-1 block">Mínimo de unidades/cajas</span>
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Stock Total *</label>
              <input 
                type="number" 
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Stock en Bodega Principal</label>
              <input 
                type="number" 
                min="0"
                value={warehouseStock}
                onChange={(e) => setWarehouseStock(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Stock en Tienda Física</label>
              <input 
                type="number" 
                min="0"
                value={storeStock}
                onChange={(e) => setStoreStock(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Stock Web Online</label>
              <input 
                type="number" 
                min="0"
                value={webStock}
                onChange={(e) => setWebStock(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block uppercase font-bold text-neutral-500 mb-1">Cantidad de Cajas / Lotes</label>
              <input 
                type="number" 
                min="0"
                value={boxesCount}
                onChange={(e) => setBoxesCount(Number(e.target.value))}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-brand-surface flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isFeaturedToggle"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-black w-4 h-4 shrink-0"
            />
            <label htmlFor="isFeaturedToggle" className="text-xs font-bold uppercase text-brand-black cursor-pointer">
              Destacar producto en la Portada Principal de la Tienda
            </label>
          </div>
        </div>

        {/* SECTION 3: Galería Fotográfica en Alta Resolución (1900 x 2375 px) */}
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-brand-border pb-3 gap-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 3. Galería de Fotos (1900 × 2375 PX)
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">Mínimo 1 foto de estudio + 1 foto in-situ</span>
          </div>

          {/* Image Upload & URL Row */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              {/* Direct File Picker Button (PC / Phone Gallery) */}
              <label className={`cursor-pointer bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-3 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-subtle shrink-0 min-h-[42px] ${isUploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
                <Upload className={`w-4 h-4 text-amber-300 shrink-0 ${isUploadingImage ? 'animate-bounce' : ''}`} />
                <span>{isUploadingImage ? 'Subiendo...' : 'Seleccionar Fotos de Mi Equipo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  disabled={isUploadingImage}
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>

              {/* URL Input with Enter key handling */}
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  placeholder="o pegue URL de imagen (1900 x 2375 px)..."
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
                  className="bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-3 sm:px-4 hover:bg-black flex items-center justify-center gap-1 shrink-0 min-h-[42px]"
                >
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Agregar URL</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono pt-1 flex-wrap">
              <span>Fotos de prueba:</span>
              <button 
                type="button"
                onClick={() => setImages(prev => [...prev, '/images/lampara_bowie_1786563431628.jpg'])}
                className="underline hover:text-black"
              >
                + Bowie
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => setImages(prev => [...prev, '/images/lampara_walter_1786563440748.jpg'])}
                className="underline hover:text-black"
              >
                + Walter
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

          {/* Images Grid Cards with Drag & Drop and Reorder Controls */}
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center bg-neutral-50/50 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">No hay fotos seleccionadas aún</p>
              <p className="text-[11px] text-neutral-500 max-w-sm">
                Haz clic en el botón <strong className="text-neutral-700">"Seleccionar Fotos de Mi Equipo"</strong> arriba o usa la cámara/galería de tu móvil para subir las fotografías del producto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`group relative aspect-[1900/2375] bg-[#FAF9F6] border ${
                  idx === 0 ? 'border-brand-black ring-2 ring-brand-black/30' : 'border-neutral-300'
                } overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md`}
              >
                <img src={img} alt={`Vista ${idx+1}`} className="w-full h-full object-cover select-none pointer-events-none" />
                
                {/* Badge indicating Portada or Foto Number */}
                <div className="absolute top-2 left-2 bg-black/85 text-white text-[8.5px] font-mono px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-xs z-10">
                  <GripVertical className="w-2.5 h-2.5 opacity-70" />
                  {idx === 0 ? '★ PORTADA PRINCIPAL' : `FOTO ${idx+1}`}
                </div>

                {/* Set as Main Cover Image Button */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMainImage(idx)}
                    className="absolute top-2 right-9 bg-amber-500 hover:bg-amber-600 text-white p-1 rounded-xs shadow-xs transition-colors z-10"
                    title="Establecer como Foto Principal (Portada)"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </button>
                )}

                {/* Delete Button */}
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-xs hover:bg-red-700 transition-colors shadow-xs z-10"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Reorder Left / Right Move Overlay Controls */}
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveImage(idx, 'left')}
                    className={`p-1.5 rounded bg-black/80 text-white hover:bg-black transition-colors ${
                      idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    title="Mover foto a la izquierda"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-[9px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider backdrop-blur-xs">
                    {idx === 0 ? 'Portada' : `Pos. ${idx + 1}`}
                  </span>

                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMoveImage(idx, 'right')}
                    className={`p-1.5 rounded bg-black/80 text-white hover:bg-black transition-colors ${
                      idx === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    title="Mover foto a la derecha"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* SECTION 4: Gestor de Muestras de Color / Acabados */}
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <Palette className="w-4 h-4" /> 4. Variantes de Acabado / Colores (Swatches)
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <input 
              type="text" 
              placeholder="Nombre del acabado (ej. Cromo Espejo, Latón Satinado)"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="flex-1 bg-brand-surface border border-brand-border p-2.5 text-xs focus:outline-none focus:border-brand-black"
            />
            <div className="flex items-center gap-2 border border-brand-border p-1.5 bg-brand-surface justify-between sm:justify-start">
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
              className="bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-neutral-800 min-h-[38px]"
            >
              + Agregar Color
            </button>
          </div>

          {/* List of Swatches */}
          <div className="flex flex-wrap gap-2 pt-1">
            {colors.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-brand-surface border border-brand-border px-3 py-1.5 text-xs">
                <span className="w-3.5 h-3.5 rounded-full border border-neutral-400 shrink-0" style={{ backgroundColor: c.hex }} />
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
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            5. Especificaciones & Materiales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
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

        {/* SECTION 6: Posventa, Envío, Devoluciones y Cuidados */}
        <div className="bg-white p-4 sm:p-6 border border-brand-border space-y-4 sm:space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
            6. Envío, Devoluciones e Instrucciones de Tratamiento (Posventa)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Etiqueta de Envío Rápido</label>
              <input 
                type="text" 
                placeholder="Ej. En 3-5 días hábiles a tu domicilio"
                value={fastShippingBadge}
                onChange={(e) => setFastShippingBadge(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Etiqueta de Devolución / Garantía</label>
              <input 
                type="text" 
                placeholder="Ej. Garantía directa y devoluciones según política"
                value={returnsPolicyBadge}
                onChange={(e) => setReturnsPolicyBadge(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block uppercase font-bold text-neutral-500 mb-1">Detalles Desplegables de Envío & Devolución</label>
              <textarea 
                rows={3}
                placeholder="Escriba la información sobre embalaje especial, tiempos de despacho y términos de devolución..."
                value={shippingReturnsInfo}
                onChange={(e) => setShippingReturnsInfo(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block uppercase font-bold text-neutral-500 mb-1">Instrucciones de Tratamiento & Cuidado</label>
              <textarea 
                rows={3}
                placeholder="Escriba recomendaciones de limpieza, productos a evitar, paño de microfibra..."
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-brand-black focus:outline-none focus:border-brand-black leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-brand-border">
          <button 
            type="button"
            onClick={onSuccess}
            className="w-full sm:w-auto bg-transparent border border-brand-black text-brand-black text-xs font-bold uppercase tracking-widest py-3.5 sm:py-4 px-8 hover:bg-neutral-100 min-h-[44px]"
          >
            Cancelar
          </button>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3.5 sm:py-4 px-8 sm:px-10 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-elevated min-h-[44px]"
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
