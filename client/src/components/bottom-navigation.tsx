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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden z-30 safe-area-inset-bottom">
      <div className="grid grid-cols-5 py-1 px-2">
        <Link href="/">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-1 h-auto space-y-1 rounded-xl transition-all duration-200 ${
              isActive("/") 
                ? "text-nature-green bg-nature-green/10" 
                : "text-gray-600 hover:text-nature-green hover:bg-gray-50 active:bg-gray-100"
            }`}
            onClick={scrollToTop}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>
        </Link>
        
        <Link href="/products">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-1 h-auto space-y-1 rounded-xl transition-all duration-200 ${
              isActive("/products") 
                ? "text-nature-green bg-nature-green/10" 
                : "text-gray-600 hover:text-nature-green hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-xs font-medium">Products</span>
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-1 h-auto space-y-1 text-gray-600 hover:text-nature-green hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all duration-200"
          onClick={() => {
            document.querySelector('input[type="text"]')?.focus();
          }}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs font-medium">Search</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-1 h-auto space-y-1 text-gray-600 hover:text-nature-green hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all duration-200 relative"
          onClick={toggleCart}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <Badge
                variant="default"
                className="absolute -top-2 -right-2 bg-nature-green text-white text-xs rounded-full h-4 w-4 flex items-center justify-center p-0 animate-bounce"
              >
                {getTotalItems()}
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium">Cart</span>
        </Button>
        
        <Link href="/account">
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 px-1 h-auto space-y-1 rounded-xl transition-all duration-200 ${
              isActive("/account") 
                ? "text-nature-green bg-nature-green/10" 
                : "text-gray-600 hover:text-nature-green hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Account</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
