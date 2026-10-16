import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductReview, ProductReviewStats } from '../types';

const LOCAL_STORAGE_REVIEWS_KEY = 'luxe_product_reviews_cache';

// Local storage fallback helper
const getLocalReviews = (): ProductReview[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalReviews = (reviews: ProductReview[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving reviews to local storage:', e);
  }
};

export const reviewService = {
  /**
   * Fetches approved reviews for a given product ID or slug from Supabase.
   */
  async getReviews(productIdOrSlug: string): Promise<ProductReview[]> {
    if (!productIdOrSlug) return [];

    let reviews: ProductReview[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', productIdOrSlug)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (!error && data) {
          reviews = data as ProductReview[];
          // Keep local cache synced
          const allLocal = getLocalReviews().filter(r => r.product_id !== productIdOrSlug);
          saveLocalReviews([...allLocal, ...reviews]);
          return reviews;
        } else if (error) {
          console.warn('Supabase fetch product_reviews error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch product_reviews exception:', err);
      }
    }

    // Fallback to local storage
    const allLocal = getLocalReviews();
    return allLocal.filter(r => r.product_id === productIdOrSlug && r.status === 'approved');
  },

  /**
   * Creates a new review in Supabase and local storage.
   */
  async createReview(params: {
    productId: string;
    userId?: string;
    userName: string;
    userEmail: string;
    rating: number;
    title?: string;
    comment: string;
  }): Promise<{ success: boolean; review?: ProductReview; error?: string }> {
    const cleanRating = Math.max(1, Math.min(5, Math.round(params.rating)));

    const newReview: ProductReview = {
      id: crypto.randomUUID ? crypto.randomUUID() : `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      product_id: params.productId,
      user_id: params.userId,
      user_name: params.userName.trim(),
      user_email: params.userEmail.trim(),
      rating: cleanRating,
      title: params.title?.trim() || undefined,
      comment: params.comment.trim(),
      status: 'approved', // Live publish
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const insertPayload: any = {
          product_id: newReview.product_id,
          user_name: newReview.user_name,
          user_email: newReview.user_email,
          rating: newReview.rating,
          title: newReview.title || null,
          comment: newReview.comment,
          status: newReview.status
        };

        const isValidUUID = Boolean(
          newReview.user_id &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newReview.user_id)
        );

        if (isValidUUID) {
          try {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', newReview.user_id)
              .maybeSingle();

            if (!existingProfile) {
              await supabase.from('profiles').insert([{
                id: newReview.user_id,
                full_name: newReview.user_name,
                email: newReview.user_email,
                role: 'customer',
                status: 'active'
              }]);
            }
            insertPayload.user_id = newReview.user_id;
          } catch (profileErr) {
            console.warn('Could not verify profile existence:', profileErr);
          }
        }

        let { data, error } = await supabase
          .from('product_reviews')
          .insert([insertPayload])
          .select('*')
          .single();

        // Auto-heal fallback: If foreign key error occurred, retry without user_id
        if (error && (error.message.includes('foreign key') || error.message.includes('product_reviews_user_id_fkey'))) {
          console.warn('Foreign key violation on user_id, retrying without user_id link...');
          delete insertPayload.user_id;
          const retry = await supabase
            .from('product_reviews')
            .insert([insertPayload])
            .select('*')
            .single();
          data = retry.data;
          error = retry.error;
        }

        if (!error && data) {
          const created = data as ProductReview;
          const currentLocal = getLocalReviews();
          saveLocalReviews([created, ...currentLocal]);
          window.dispatchEvent(new CustomEvent('reviews_updated', { detail: { productId: params.productId } }));
          return { success: true, review: created };
        } else if (error) {
          console.error('Supabase review insert error:', error.message);
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.error('Supabase review insert exception:', err);
        return { success: false, error: err.message || 'Error de conexión con la base de datos' };
      }
    }

    // Local fallback
    const currentLocal = getLocalReviews();
    saveLocalReviews([newReview, ...currentLocal]);
    window.dispatchEvent(new CustomEvent('reviews_updated', { detail: { productId: params.productId } }));
    return { success: true, review: newReview };
  },

  /**
   * Calculates rating metrics (average score, total count, star distribution).
   */
  calculateStats(reviews: ProductReview[]): ProductReviewStats {
    const distribution: { [stars: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution
      };
    }

    let sum = 0;
    reviews.forEach(r => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      distribution[star] = (distribution[star] || 0) + 1;
      sum += star;
    });

    const averageRating = Number((sum / reviews.length).toFixed(1));

    return {
      averageRating,
      totalReviews: reviews.length,
      distribution
    };
  },

  /**
   * Subscribes to reviews updates for a specific product.
   */
  subscribeToReviews(productId: string, callback: () => void): () => void {
    const handleEvent = (e: any) => {
      if (!e.detail || e.detail.productId === productId) {
        callback();
      }
    };

    window.addEventListener('reviews_updated', handleEvent);

    let supabaseChannel: any = null;
    if (isSupabaseConfigured()) {
      try {
        supabaseChannel = supabase
          .channel(`reviews_realtime_${productId}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'product_reviews', filter: `product_id=eq.${productId}` },
            () => {
              callback();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription error for reviews:', err);
      }
    }

    return () => {
      window.removeEventListener('reviews_updated', handleEvent);
      if (supabaseChannel) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  }
};
