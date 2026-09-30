# 🛒 Documentación Técnica - Normalización de Pedidos y Blindaje de Inventario (Fase 5)

Esta documentación describe la arquitectura relacional de pedidos y la deducción atómica de inventario implementada en **Supabase PostgreSQL**.

---

## 🗄️ 1. Tabla Normalizada `order_items`

Reemplaza la dependencia exclusiva de blobs JSONB en `orders.items` por una estructura relacional limpia con respaldo `snapshot`:

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  product_snapshot JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 🔑 Definición de Campos

| Campo | Tipo SQL | Descripción / Propósito |
| :--- | :--- | :--- |
| `id` | `UUID` | Identificador único del ítem (PK). |
| `order_id` | `UUID` | Llave foránea (`FK`) vinculada a `orders(id)`. Si la orden se elimina, sus ítems se eliminan en cascada (`ON DELETE CASCADE`). |
| `product_id` | `UUID` | Llave foránea (`FK`) vinculada a `products(id)`. Si el producto se elimina, la referencia se mantiene en NULL (`ON DELETE SET NULL`). |
| `quantity` | `INT` | Unidades compradas (> 0). |
| `unit_price` | `DECIMAL(12,2)` | Precio unitario congelado al momento exacto de la compra. |
| `total_price` | `DECIMAL(12,2)` | Subtotal del ítem (`quantity * unit_price`). |
| `product_snapshot` | `JSONB` | Copia de seguridad del SKU, Nombre, Color y Fotografía al momento de la compra (invariable a futuros cambios de catálogo). |

---

## ⚡ 2. Función PL/pgSQL Atómica `process_order_checkout(...)`

Maneja el checkout en **una sola transacción PostgreSQL**, garantizando blindaje financiero y prevención de sobreventa (*overselling*):

1. **Inserta la cabecera** en `orders`.
2. **Itera cada ítem**:
   - Valida el stock en `products.stock`. Si `stock < cantidad_solicitada`, ejecuta un **`ROLLBACK` automático** con la excepción:  
     `Stock insuficiente para el producto SKU [SKU]`.
   - Si hay stock, realiza el descuento atómico:  
     `stock = stock - cantidad`, `web_stock = web_stock - cantidad`.
   - Si `stock` llega a `0`, actualiza automáticamente `inventory_status = 'Agotado'`.
3. **Inserta el ítem en `order_items`** con su snapshot congelado.

---

## 🔒 3. Políticas de Seguridad RLS (Row Level Security)

- **SELECT**: Habilitado para consultar ítems de pedidos.
- **ALL (INSERT / UPDATE / DELETE)**: Restringido a la función transaccional `process_order_checkout` y a usuarios autenticados.

---

## 🔄 4. Preservación de Compatibilidad Retroactiva

- La columna `orders.items` en JSONB se sigue completando automáticamente durante la transacción para mantener funcionando los paneles de Back Office actuales sin disrupciones.
