# 🔍 Auditoría Técnica del Sistema Actual y Mapa de Arquitectura

**Fecha de Auditoría**: 2026-10-02  
**Repositorio**: `diseno-tu-espacio`  
**Rama**: `main`  

---

## 1. 📍 Ubicación Exacta del Banner "Persistencia Local Resguardada"

- **Archivo**: `src/pages/AdminDashboardPage.tsx`
- **Línea exacta**: Línea 651
- **Extracto de Código**:
  ```tsx
  {supabaseStatus.isConnected ? 'Nube Supabase Activa' : 'Persistencia Local Resguardada'}
  ```
- **Descripción del Componente**:
  Píldora/badge de estado en la barra superior del cabezal del Back-Office. Muestra **"Nube Supabase Activa"** con un indicador verde pulsante si la conexión a Supabase está operativa, y conmuta a **"Persistencia Local Resguardada"** con un indicador ámbar si la comprobación de salud de Supabase reporta desconexión o fallback.

---

## 2. 🗺️ Mapa de Servicios de Datos y Estado de `localStorage`

### A. Servicio de Productos: `src/services/productService.ts`
- **Llamadas a Supabase**: Consultas directas a `supabase.from('products')` para operaciones de `SELECT`, `INSERT`, `UPDATE`, `DELETE`, y `supabase.storage` para imágenes (`product-images`).
- **Estado respecto a `localStorage`**:
  - **Lectura/Escritura de Catálogo**: ❌ **Erradicada 100%**. Ningún catálogo, producto ni lista de claves eliminadas se guarda o lee en `localStorage`.
  - **Limpieza (Purga)**: Incluye la función ejecutable al iniciar el módulo `clearLegacyProductLocalStorage()` que elimina llaves obsoletas pesadas (ej. `luxe_products_v16`, `luxe_catalog`) de los navegadores para prevenir errores de cuota (`QuotaExceededError`).
  - **Estrategia de Red**: Consultas en vivo a la red (Network-First) actualizando la memoria RAM (`memoryProductsCache`) únicamente durante la sesión activa.

### B. Servicio de Pedidos: `src/services/orderService.ts`
- **Llamadas a Supabase**: Consultas directas a `supabase.from('orders')` y `supabase.from('order_items')` para operaciones de `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **Estado respecto a `localStorage`**:
  - **Lectura/Escritura de Pedidos**: ❌ **Erradicada 100%**. Ninguna orden ni clave de pedido se persiste localmente en disco/navegador.
  - **Limpieza (Purga)**: Incluye la función `clearLegacyOrderLocalStorage()` para purgar llaves antiguas de pedidos (`luxe_orders_v2`).
  - **Estrategia de Borrado**: Borrado directo por UUID/ID primario (`.eq('id', id)`) y eliminación de registros relacionales dependientes.

---

## 3. 🚀 Destino de Despliegue y Control de Versiones

### A. Repositorio Remoto (Git)
- **URL Remota (Origin)**: `https://github.com/marketdesingtuespacio-cmyk/diseno-tu-espacio.git`
- **Rama Principal**: `main`
- **Último Commit Enviado**: `0123f5c` (*refactor(orders): garantizar borrado estricto por UUID id en Supabase y purgar mensajes de respaldo local*)

### B. Plataforma de Hosting y Despliegue
- **Entorno de Despliegue**: Cloudflare Pages / Vercel (conectado por CI/CD automático ante cada `push` a la rama `main` de GitHub).
- **Comando de Compilación**: `npm run build` (`tsc && vite build`).
- **Directorio de Build Distribuible**: `dist/`
