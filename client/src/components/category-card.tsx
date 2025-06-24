import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className={`group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer active:scale-95 ${className}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={category.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03"}
              alt={category.name}
              className="w-full h-28 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
              <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-1 group-hover:text-warm-cream transition-colors">
                {category.name}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                {category.productCount} products
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
