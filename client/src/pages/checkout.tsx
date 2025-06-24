import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        clearCart();
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        setLocation("/account");
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-nature-green hover:bg-forest-green"
      >
        {isProcessing ? "Processing..." : "Complete Purchase"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { items, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount: getTotalPrice(),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [items, getTotalPrice]);

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

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-green mx-auto mb-4"></div>
              <p className="text-gray-700">Preparing checkout...</p>
            </div>
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
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
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
