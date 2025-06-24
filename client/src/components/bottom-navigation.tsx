import { Home, Leaf, Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { getTotalItems, toggleCart } = useCart();

  const isActive = (path: string) => location === path;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
      <div className="grid grid-cols-5 py-2">
        <Link href="/">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 h-auto space-y-1 touch-feedback ${
              isActive("/") ? "text-nature-green" : "text-gray-600"
            }`}
            onClick={scrollToTop}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        
        <Link href="/products">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 h-auto space-y-1 touch-feedback ${
              isActive("/products") ? "text-nature-green" : "text-gray-600"
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-xs">Products</span>
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 h-auto space-y-1 text-gray-600 touch-feedback"
          onClick={() => {
            // TODO: Implement search functionality
            console.log("Search not implemented");
          }}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Search</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 h-auto space-y-1 text-gray-600 touch-feedback relative"
          onClick={toggleCart}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <Badge
                variant="default"
                className="absolute -top-2 -right-2 bg-nature-green text-white text-xs rounded-full h-4 w-4 flex items-center justify-center p-0"
              >
                {getTotalItems()}
              </Badge>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </Button>
        
        <Link href="/account">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 h-auto space-y-1 touch-feedback ${
              isActive("/account") ? "text-nature-green" : "text-gray-600"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
