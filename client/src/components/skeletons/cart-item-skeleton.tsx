import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CartItemSkeleton() {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}