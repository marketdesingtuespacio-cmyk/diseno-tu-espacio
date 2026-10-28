// Servicio Unificado de Tracking de Comercio Electrónico
// Soporta Meta Pixel (Facebook / Instagram Ads) y Google Analytics 4 (Google Shopping / Ads)

import { Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackingService = {
  // 1. Cuando el usuario ve la página de un producto (ViewContent / view_item)
  trackViewItem(product: Product) {
    if (typeof window === 'undefined') return;

    const id = product.sku || product.id;
    const price = Number(product.price || 0);

    // Meta Pixel: ViewContent
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [id],
        content_type: 'product',
        value: price,
        currency: 'COP'
      });
      console.log(`[Tracking] Meta Pixel: ViewContent (${id})`);
    }

    // Google Analytics 4: view_item
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'COP',
        value: price,
        items: [
          {
            item_id: id,
            item_name: product.name,
            item_category: product.category,
            price: price,
            quantity: 1
          }
        ]
      });
      console.log(`[Tracking] Google Analytics: view_item (${id})`);
    }
  },

  // 2. Cuando el usuario añade un producto al carrito (AddToCart / add_to_cart)
  trackAddToCart(product: Product, quantity: number = 1) {
    if (typeof window === 'undefined') return;

    const id = product.sku || product.id;
    const price = Number(product.price || 0);

    // Meta Pixel: AddToCart
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [id],
        content_type: 'product',
        value: price * quantity,
        currency: 'COP'
      });
      console.log(`[Tracking] Meta Pixel: AddToCart (${id} x${quantity})`);
    }

    // Google Analytics 4: add_to_cart
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'COP',
        value: price * quantity,
        items: [
          {
            item_id: id,
            item_name: product.name,
            item_category: product.category,
            price: price,
            quantity: quantity
          }
        ]
      });
      console.log(`[Tracking] Google Analytics: add_to_cart (${id})`);
    }
  },

  // 3. Cuando el usuario inicia el checkout (InitiateCheckout / begin_checkout)
  trackInitiateCheckout(cartItems: CartItem[], total: number) {
    if (typeof window === 'undefined') return;

    const contentIds = cartItems.map(item => item.product.sku || item.product.id);
    const numItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Meta Pixel: InitiateCheckout
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: contentIds,
        content_type: 'product',
        num_items: numItems,
        value: total,
        currency: 'COP'
      });
      console.log(`[Tracking] Meta Pixel: InitiateCheckout (${numItems} items)`);
    }

    // Google Analytics 4: begin_checkout
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'COP',
        value: total,
        items: cartItems.map(item => ({
          item_id: item.product.sku || item.product.id,
          item_name: item.product.name,
          item_category: item.product.category,
          price: item.product.price,
          quantity: item.quantity
        }))
      });
      console.log(`[Tracking] Google Analytics: begin_checkout`);
    }
  },

  // 4. Cuando se completa una compra (Purchase / purchase)
  trackPurchase(order: Order) {
    if (typeof window === 'undefined') return;

    const contentIds = (order.items || []).map(item => item.product_id);
    const total = Number(order.total || 0);

    // Meta Pixel: Purchase
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: contentIds,
        content_type: 'product',
        value: total,
        currency: 'COP',
        order_id: order.order_ref || order.id
      });
      console.log(`[Tracking] Meta Pixel: Purchase (${order.order_ref})`);
    }

    // Google Analytics 4: purchase
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.order_ref || order.id,
        value: total,
        currency: 'COP',
        items: (order.items || []).map(item => ({
          item_id: item.product_id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
      console.log(`[Tracking] Google Analytics: purchase`);
    }
  }
};
