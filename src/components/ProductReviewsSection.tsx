import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, CheckCircle, MessageSquare, Plus, X, User, ShieldCheck } from 'lucide-react';
import { ProductReview, ProductReviewStats } from '../types';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  onStatsCalculated?: (stats: ProductReviewStats) => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
  onStatsCalculated
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<ProductReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load reviews from service
  const loadReviews = async () => {
    try {
      const data = await reviewService.getReviews(productId);
      setReviews(data);
      const calculated = reviewService.calculateStats(data);
      setStats(calculated);
      if (onStatsCalculated) {
        onStatsCalculated(calculated);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    const unsub = reviewService.subscribeToReviews(productId, () => {
      loadReviews();
    });
    return () => unsub();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    if (!comment.trim()) {
      setSubmitError('Por favor redacta tu opinión sobre el producto.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const result = await reviewService.createReview({
      productId,
      userId: user.id,
      userName: user.full_name || 'Cliente Verificado',
      userEmail: user.email || '',
      rating,
      title: title.trim(),
      comment: comment.trim()
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setTitle('');
      setComment('');
      setRating(5);
      await loadReviews();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } else {
      setSubmitError(result.error || 'No se pudo guardar la reseña. Inténtalo de nuevo.');
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return 'Excelente — Superó mis expectativas';
      case 4: return 'Muy Bueno — Gran calidad';
      case 3: return 'Bueno — Conforme a la descripción';
      case 2: return 'Regular — Esperaba más';
      case 1: return 'Insatisfecho';
      default: return '';
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <section id="reviews-section" className="pt-16 border-t border-neutral-200 font-sans space-y-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1">
            Experiencias Verificadas
          </span>
          <h2 className="text-2xl font-light text-neutral-900 uppercase tracking-tight">
            Reseñas & Opiniones de Clientes
          </h2>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 hover:bg-neutral-800 transition-colors shadow-subtle active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Escribir una Reseña
          </button>
        </div>
      </div>

      {/* Breakdown Cards & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-brand-surface p-6 sm:p-8 border border-neutral-200">
        
        {/* Overall Score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-neutral-200 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-5xl font-light text-neutral-900 tracking-tight">
              {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-neutral-400 uppercase font-semibold">/ 5.0</span>
          </div>

          <div className="flex justify-center md:justify-start text-emerald-600">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i <= Math.round(stats.averageRating)
                    ? 'fill-emerald-600 text-emerald-600'
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-neutral-500 font-light">
            {stats.totalReviews > 0
              ? `Basado en ${stats.totalReviews} ${stats.totalReviews === 1 ? 'reseña real de cliente' : 'reseñas reales de clientes'}`
              : 'Aún no se registran opiniones para este producto'}
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution[stars] || 0;
            const percentage = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 text-neutral-600 font-medium">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] text-neutral-400 font-mono">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-400 animate-pulse">
            Cargando reseñas verificadas...
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 border border-neutral-200 space-y-3 shadow-subtle hover:border-neutral-400 transition-colors"
              >
                {/* Header: Stars + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-emerald-600">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= rev.rating
                            ? 'fill-emerald-600 text-emerald-600'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {formatDate(rev.created_at)}
                  </span>
                </div>

                {/* Review Title */}
                {rev.title && (
                  <h4 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    {rev.title}
                  </h4>
                )}

                {/* Comment */}
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Author Info */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{rev.user_name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verificado
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 text-center border border-dashed border-neutral-300 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-neutral-900">
              Aún no hay opiniones para esta pieza
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto font-light">
              ¿Has adquirido o trabajado en tu proyecto con esta pieza? Comparte tu experiencia con otros interioristas y arquitectos.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold uppercase tracking-widest text-brand-black hover:underline pt-1"
            >
              Sé el primero en opinar →
            </button>
          </div>
        )}
      </div>

      {/* WRITE REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-border space-y-6 animate-in fade-in zoom-in-95 duration-200 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            {!isAuthenticated ? (
              /* Case 1: User NOT logged in */
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-neutral-900 uppercase tracking-tight">
                    Inicia Sesión para Opinar
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1 max-w-sm mx-auto">
                    Para mantener la autenticidad y transparencia de las reseñas en <strong>Diseño Tu Espacio</strong>, es necesario contar con una cuenta registrada.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                    className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors"
                  >
                    Iniciar Sesión / Registrarme
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : submitSuccess ? (
              /* Case 2: Success Message */
              <div className="text-center space-y-3 py-6">
                <CheckCircle className="w-12 h-12 mx-auto text-emerald-600 animate-bounce" />
                <h3 className="text-lg font-medium text-neutral-900">
                  ¡Muchas gracias por tu reseña!
                </h3>
                <p className="text-xs text-neutral-500 font-light">
                  Tu opinión ya ha sido registrada y publicada en la ficha del producto.
                </p>
              </div>
            ) : (
              /* Case 3: Review Form */
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                    Tu Opinión
                  </span>
                  <h3 className="text-xl font-light text-neutral-900 tracking-tight">
                    Calificar {productName}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Comentando como: <strong className="text-neutral-800">{user?.full_name}</strong> ({user?.email})
                  </p>
                </div>

                {/* Star Picker */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                    Puntuación General
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const activeStars = hoverRating || rating;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                            aria-label={`${starVal} estrellas`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                starVal <= activeStars
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-neutral-500 font-medium ml-2">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>
                </div>

                {/* Review Headline */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                    Título de tu Reseña (Opcional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Acabados impecables, iluminación perfecta"
                    className="w-full text-xs p-2.5 border border-neutral-300 focus:outline-none focus:border-brand-black"
                  />
                </div>

                {/* Comment Body */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                    Tu Reseña Detallada *
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe los materiales, facilidad de instalación, apariencia en tu espacio..."
                    required
                    className="w-full text-xs p-2.5 border border-neutral-300 focus:outline-none focus:border-brand-black"
                  />
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {submitError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs uppercase font-bold tracking-widest text-neutral-500 hover:text-black px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-subtle"
                  >
                    {submitting ? 'Publicando...' : 'Publicar Reseña'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
