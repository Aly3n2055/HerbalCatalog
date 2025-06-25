import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}