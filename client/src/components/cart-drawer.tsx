import { Trash2, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

function CartDrawer() {
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
      <SheetContent side="right" className="w-full max-w-sm sm:max-w-md bg-white p-0" aria-describedby="cart-description">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg sm:text-xl font-semibold">Shopping Cart</SheetTitle>
              <Badge variant="secondary" className="bg-nature-green/10 text-nature-green">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>
             <p id="cart-description" className="sr-only">
            Review and manage items in your shopping cart. You can update quantities or remove items before checkout.
          </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="text-2xl">🛒</div>
                </div>
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <Button
                  onClick={handleContinueShopping}
                  className="bg-nature-green hover:bg-forest-green rounded-xl px-6 py-3"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 bg-gray-50/70 p-3 sm:p-4 rounded-xl border border-gray-100">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base leading-tight line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm sm:text-base font-semibold text-nature-green mb-3">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-full border-gray-300 hover:border-nature-green hover:bg-nature-green/5"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-semibold min-w-8 text-center bg-white px-2 py-1 rounded-md border border-gray-200">
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
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg sm:text-xl font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-nature-green">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full bg-nature-green text-white hover:bg-forest-green rounded-xl py-3 sm:py-4 font-semibold text-base active:scale-95 transition-all duration-200"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3 font-medium"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;