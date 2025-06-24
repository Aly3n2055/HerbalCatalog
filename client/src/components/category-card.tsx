import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className = "" }: CategoryCardProps) {
  return (
    <Link href={`/products/${category.slug}`}>
      <Card className={`hover:shadow-md transition-all cursor-pointer touch-feedback ${className}`}>
        <CardContent className="p-4 text-center">
          <img
            src={category.imageUrl || "https://via.placeholder.com/200x100"}
            alt={category.name}
            className="w-full h-24 object-cover rounded-lg mb-3"
            loading="lazy"
          />
          <h4 className="font-medium text-gray-800">
            {category.name}
          </h4>
          <p className="text-sm text-gray-500">
            {category.productCount} products
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
