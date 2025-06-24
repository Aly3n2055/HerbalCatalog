import { useState } from "react";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import PayPalButton from "@/components/PayPalButton";

const CheckoutForm = () => {
  const { getTotalPrice } = useCart();

  return (
    <div className="space-y-6">
      <div className="p-4 bg-stone-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          You will be redirected to PayPal to complete your payment securely.
        </p>
        <PayPalButton 
          amount={getTotalPrice().toFixed(2)}
          currency="USD"
          intent="CAPTURE"
        />
      </div>
    </div>
  );
};

export default function Checkout() {
  const { items, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
                <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
                <Link href="/products">
                  <Button className="bg-nature-green hover:bg-forest-green">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in</h1>
                <p className="text-gray-600 mb-6">You need to be signed in to complete your purchase.</p>
                <Link href="/account">
                  <Button className="bg-nature-green hover:bg-forest-green">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50/70 rounded-xl">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base line-clamp-2">{item.product.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Qty: {item.quantity} × ${parseFloat(item.product.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-nature-green">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Subtotal ({getTotalItems()} items):</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Shipping:</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between text-lg sm:text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-nature-green">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="order-1 lg:order-2">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
