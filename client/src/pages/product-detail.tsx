import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Star, ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
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
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg skeleton"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded skeleton"></div>
                <div className="bg-gray-200 h-4 rounded skeleton"></div>
                <div className="bg-gray-200 h-4 rounded skeleton"></div>
                <div className="bg-gray-200 h-10 rounded skeleton"></div>
              </div>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <Link href="/products">
              <Button className="bg-nature-green hover:bg-forest-green">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <CartDrawer />

      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/products">
            <Button variant="ghost" className="mb-6 touch-feedback">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-golden text-white">
                  Featured
                </Badge>
              )}
              <Button
                variant="ghost"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg">
                  {product.shortDescription}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(parseFloat(product.rating || "0"))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-nature-green">
                ${parseFloat(product.price).toFixed(2)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Add to Cart */}
              <Button
                className="w-full bg-nature-green hover:bg-forest-green text-white py-3 touch-feedback"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {/* External URL */}
              {product.externalUrl && (
                <Button
                  variant="outline"
                  className="w-full border-nature-green text-nature-green hover:bg-nature-green hover:text-white"
                  onClick={() => window.open(product.externalUrl!, '_blank')}
                >
                  Buy from Partner Store
                </Button>
              )}
            </div>
          </div>

          {/* Product Description */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Product Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Product Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium">NV-{product.id.toString().padStart(4, '0')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
