import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col font-sans animate-pulse">
      {/* 1900 × 2375 Ratio Skeleton Frame with Subtle Shimmer */}
      <div className="relative aspect-[1900/2375] w-full bg-neutral-200/80 rounded-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Color Swatches Skeleton Bar */}
      <div className="flex items-center gap-1.5 mt-3 mb-1 h-4">
        <div className="w-3.5 h-3.5 bg-neutral-200" />
        <div className="w-3.5 h-3.5 bg-neutral-200" />
        <div className="w-3.5 h-3.5 bg-neutral-200" />
      </div>

      {/* Product Title & Brand Skeleton */}
      <div className="space-y-1.5 text-left mt-1">
        <div className="h-3.5 bg-neutral-200 w-3/4 rounded-none" />
        <div className="h-2.5 bg-neutral-200/70 w-1/2 rounded-none" />
      </div>

      {/* Price Display Skeleton */}
      <div className="mt-2">
        <div className="h-3.5 bg-neutral-200/90 w-1/3 rounded-none" />
      </div>
    </div>
  );
};
