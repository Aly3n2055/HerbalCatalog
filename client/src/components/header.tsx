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
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 sm:p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </Button>
              <Link href="/">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-nature-green cursor-pointer hover:text-forest-green transition-colors">
                  Herbal Wellness Clinic
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

            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 sm:p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 sm:p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                {getTotalItems() > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 bg-nature-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 animate-pulse"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Link href="/account">
                <Button variant="ghost" size="sm" className="p-2 sm:p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t bg-white px-4 sm:px-6 py-3 sm:py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search natural products..."
                className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-green focus:border-transparent shadow-sm"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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