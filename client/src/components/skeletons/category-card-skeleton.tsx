import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryCardSkeleton() {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between mt-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}