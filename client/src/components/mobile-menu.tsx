import { Link } from "wouter";
import { X, Leaf, Info, Handshake, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

import { useAuth } from "@/hooks/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-white">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-nature-green">
            Menu
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <Link href="/products" onClick={handleLinkClick}>
            <div className="flex items-center py-3 text-gray-700 hover:text-nature-green transition-colors border-b border-gray-100 cursor-pointer">
              <Leaf className="mr-3 h-5 w-5" />
              Products
            </div>
          </Link>
          
          <Link href="/distributor" onClick={handleLinkClick}>
            <div className="flex items-center py-3 text-gray-700 hover:text-nature-green transition-colors border-b border-gray-100 cursor-pointer">
              <Handshake className="mr-3 h-5 w-5" />
              Become a Partner
            </div>
          </Link>
          
          <Link href="/account" onClick={handleLinkClick}>
            <div className="flex items-center py-3 text-gray-700 hover:text-nature-green transition-colors border-b border-gray-100 cursor-pointer">
              <Mail className="mr-3 h-5 w-5" />
              Account
            </div>
          </Link>
          
          <div className="pt-4">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Welcome back, {user.username}!</p>
                <Link href="/account" onClick={handleLinkClick}>
                  <Button className="w-full bg-nature-green text-white hover:bg-forest-green">
                    My Account
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/account" onClick={handleLinkClick}>
                <Button className="w-full bg-nature-green text-white hover:bg-forest-green">
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
