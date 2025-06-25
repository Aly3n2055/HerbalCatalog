import ProductCardSkeleton from "./product-card-skeleton";

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export default function ProductGridSkeleton({ count = 6, className = "" }: ProductGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}