import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}