import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCart();

  const isActive = (path: string) => location === path;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden touch-feedback p-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
              <Link href="/">
                <h1 className="text-xl font-bold text-nature-green cursor-pointer">
                  NatureVital
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/products"
                className={`text-gray-700 hover:text-nature-green transition-colors ${
                  isActive("/products") ? "text-nature-green font-medium" : ""
                }`}
              >
                Products
              </Link>
              <Link
                href="/distributor"
                className={`text-gray-700 hover:text-nature-green transition-colors ${
                  isActive("/distributor") ? "text-nature-green font-medium" : ""
                }`}
              >
                Become a Partner
              </Link>
              <Link
                href="/account"
                className={`text-gray-700 hover:text-nature-green transition-colors ${
                  isActive("/account") ? "text-nature-green font-medium" : ""
                }`}
              >
                Account
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="touch-feedback p-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-6 w-6 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="touch-feedback p-2 relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 bg-nature-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Link href="/account">
                <Button variant="ghost" size="sm" className="touch-feedback p-2">
                  <User className="h-6 w-6 text-gray-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t bg-white px-4 py-3 animate-slide-up">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search natural products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}
