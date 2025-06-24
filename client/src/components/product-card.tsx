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
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
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
      <Card className={`hover:shadow-md transition-all cursor-pointer touch-feedback ${className}`}>
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-3"
              loading="lazy"
            />
            {product.featured && (
              <Badge className="absolute top-2 left-2 bg-golden text-white">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 line-clamp-2">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(parseFloat(product.rating || "0"))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-nature-green">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <Button
                size="sm"
                className="bg-nature-green hover:bg-forest-green text-white touch-feedback"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
