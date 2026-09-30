# 🏗️ Documentación Técnica - Rediseño Arquitectónico de Imágenes (Fase 3)

Esta documentación describe la nueva infraestructura de almacenamiento relacional e imágenes persistentes utilizando **Supabase Storage** y la tabla relacional `product_images` en PostgreSQL.

---

## 🗄️ 1. Estructura de la Tabla Relacional `product_images`

La tabla normalizada reemplaza la dependencia de arreglos de texto planos en `products.images`, permitiendo reordenamiento dinámico, marcas de portada principal e integridad referencial en cascada.

```sql
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 🔑 Definición de Campos

| Campo | Tipo SQL | Descripción / Propósito |
| :--- | :--- | :--- |
| `id` | `UUID` | Identificador único de la imagen (PK). |
| `product_id` | `UUID` | Llave foránea (`FK`) vinculada a `products(id)`. Si se elimina el producto, se eliminan sus imágenes (`ON DELETE CASCADE`). |
| `url` | `TEXT` | URL pública oficial generada por Supabase Storage (Ej. `https://[ref].supabase.co/storage/v1/object/public/product-images/[file_path]`). |
| `file_path` | `TEXT` | Ruta interna en el bucket para gestión y borrado de archivos (Ej. `products/[product_id]/[hash].jpg`). |
| `is_primary` | `BOOLEAN` | Indica si es la foto principal de portada (`true` / `false`). |
| `position` | `INT` | Orden numérico de visualización en la galería (`0, 1, 2...`). |
| `created_at` | `TIMESTAMPTZ` | Timestamp de subida. |

---

## ⚡ 2. Índices de Rendimiento

- `idx_product_images_product_id`: Indexación B-Tree sobre `product_id` para garantizar que las consultas de galerías de productos en el catálogo respondan en **< 5ms**.
- `idx_product_images_position`: Indexación sobre la posición para acelerar el ordenamiento de la galería.

---

## 🔒 3. Políticas de Seguridad RLS (Row Level Security)

### Tabla `public.product_images`
- **SELECT**: Habilitado públicamente (`USING (true)`).
- **ALL (INSERT / UPDATE / DELETE)**: Habilitado para usuarios administradores y colaboradores autenticados.

### Bucket de Supabase Storage (`product-images`)
- **ID del Bucket**: `product-images`
- **Acceso**: Público (`public = true`)
- **Límite de Tamaño de Archivo**: **5 MB** (5,242,880 bytes)
- **Formatos MIME Permitidos**: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`

---

## 🔄 4. Preservación de Compatibilidad Retroactiva

Para evitar romper la interfaz actual durante esta transición:
- La columna antigua `products.images` **NO se elimina** en esta fase.
- La aplicación mantendrá soporte híbrido mientras se actualizan los componentes UI (`ProductCard`, `ProductDetailPage`, `ProductRegistrationForm`) en las fases subsiguientes.

---

## 📁 5. Estructura Organizativa del Bucket `product-images`

Los archivos en Supabase Storage se organizarán bajo la siguiente convención de rutas:

```
product-images/
  ├── products/
  │   ├── [product_id_1]/
  │   │   ├── cover_[timestamp].webp
  │   │   ├── gallery_1_[timestamp].webp
  │   │   └── gallery_2_[timestamp].webp
  │   └── [product_id_2]/
  │       └── cover_[timestamp].webp
```
