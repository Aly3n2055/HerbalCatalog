import { Trash2, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    toggleCart();
    setLocation("/checkout");
  };

  const handleContinueShopping = () => {
    toggleCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent side="right" className="w-full max-w-md bg-white">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-6">
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <Button
                  onClick={handleContinueShopping}
                  className="mt-4 bg-nature-green hover:bg-forest-green"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-nature-green hover:bg-forest-green"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 p-2"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-nature-green">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-nature-green text-white hover:bg-forest-green"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
