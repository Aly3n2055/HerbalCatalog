import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}