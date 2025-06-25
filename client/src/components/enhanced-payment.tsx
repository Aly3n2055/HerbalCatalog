import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Shield, Smartphone } from "lucide-react";
import PayPalButton from "./PayPalButton";

interface EnhancedPaymentProps {
  amount: string;
  currency: string;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: any) => void;
}

export default function EnhancedPayment({ 
  amount, 
  currency, 
  onPaymentSuccess, 
  onPaymentError 
}: EnhancedPaymentProps) {
  const [activeTab, setActiveTab] = useState("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    email: "",
    zip: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardPayment = async () => {
    setIsProcessing(true);
    try {
      // Process card payment through PayPal's card processing API
      const response = await fetch('/paypal/card-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          card: cardData
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        onPaymentSuccess?.(result);
      } else {
        onPaymentError?.(result);
      }
    } catch (error) {
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose your preferred payment method
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData(prev => ({
                    ...prev,
                    number: formatCardNumber(e.target.value)
                  }))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({
                      ...prev,
                      expiry: formatExpiry(e.target.value)
                    }))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData(prev => ({
                      ...prev,
                      cvc: e.target.value.replace(/[^0-9]/g, '').substring(0, 4)
                    }))}
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cardData.email}
                  onChange={(e) => setCardData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="12345"
                  value={cardData.zip}
                  onChange={(e) => setCardData(prev => ({
                    ...prev,
                    zip: e.target.value.replace(/[^0-9]/g, '').substring(0, 10)
                  }))}
                />
              </div>

              <Button 
                onClick={handleCardPayment}
                disabled={isProcessing || !cardData.number || !cardData.expiry || !cardData.cvc}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? "Processing..." : `Pay $${amount}`}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              🔒 Your payment information is encrypted and secure
            </div>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Pay securely with your PayPal account
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <PayPalButton 
                  amount={amount}
                  currency={currency}
                  intent="CAPTURE"
                />
              </div>

              <div className="text-xs text-gray-500">
                You'll be redirected to PayPal to complete your payment
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${amount}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${amount} {currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}