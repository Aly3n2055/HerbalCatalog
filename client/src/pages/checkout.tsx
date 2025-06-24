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
      
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${parseFloat(item.product.price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-medium">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({getTotalItems()} items):</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-nature-green">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
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
