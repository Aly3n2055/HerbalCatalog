import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      variant: "success",
      title: "✓ Added to Cart!",
      description: `${product.name} has been successfully added to your cart.`,
      duration: 4000,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className={`group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer active:scale-95 ${className}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover mb-3 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {product.featured && (
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-golden to-yellow-500 text-white shadow-md">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="absolute top-2 right-2 bg-gray-500 text-white">
                Out of Stock
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-gray-800 line-clamp-2 text-sm sm:text-base group-hover:text-nature-green transition-colors">
              {product.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(parseFloat(product.rating || "0"))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-lg sm:text-xl font-bold text-nature-green">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <Button
                size="sm"
                className="bg-nature-green hover:bg-forest-green text-white rounded-xl px-3 py-2 text-xs sm:text-sm active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {product.inStock ? "Add to Cart" : "Sold Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
