'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { formatCurrency, validateKenyanPhone, formatPhone } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getSubtotal } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    notes: '',
    paymentMethod: 'MPESA',
    mpesaCode: '',
  });

  const subtotal = getSubtotal();
  const deliveryFee = formData.deliveryType === 'pickup' ? 0 : 150;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliveryStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateKenyanPhone(formData.phone)) {
      toast.error('Please enter a valid Kenyan phone number');
      return;
    }

    if (formData.deliveryType === 'delivery' && !formData.address) {
      toast.error('Please enter your delivery address');
      return;
    }

    setStep(2);
  };

  const handlePaymentStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'MPESA' && !formData.mpesaCode) {
      toast.error('Please enter your M-Pesa transaction code');
      return;
    }

    if (formData.paymentMethod === 'MPESA' && formData.mpesaCode.length < 5) {
      toast.error('M-Pesa code must be at least 5 characters');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          pricePerKg: item.pricePerKg,
          quantityKg: item.quantityKg,
        })),
        guestName: formData.fullName,
        guestPhone: formatPhone(formData.phone),
        deliveryType: formData.deliveryType === 'pickup' ? 'PICKUP' : 'DELIVERY',
        address: formData.deliveryType === 'delivery' ? formData.address : '',
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        mpesaCode: formData.paymentMethod === 'MPESA' ? formData.mpesaCode : undefined,
      };

      const response = await api.orders.create(orderData);
      clearCart();
      router.push(`/checkout/success?orderId=${response.order.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Stepper */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Delivery</span>
                </div>
                <div className="w-12 h-0.5 bg-muted" />
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
                <div className="w-12 h-0.5 bg-muted" />
                <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Confirm</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Form */}
              <div className="md:col-span-2">
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDeliveryStep} className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number (+254 7XX XXX XXX) *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+254 712 345 678"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label>Delivery Type *</Label>
                          <RadioGroup
                            value={formData.deliveryType}
                            onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="delivery" id="delivery" />
                              <Label htmlFor="delivery">Delivery</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pickup" id="pickup" />
                              <Label htmlFor="pickup">Pickup</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {formData.deliveryType === 'delivery' && (
                          <div>
                            <Label htmlFor="address">Delivery Address *</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Input
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                          Continue to Payment →
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePaymentStep} className="space-y-4">
                        <div>
                          <Label>Payment Method *</Label>
                          <RadioGroup
                            value={formData.paymentMethod}
                            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                          >
                            <div className="flex items-center space-x-2 p-3 border rounded-md">
                              <RadioGroupItem value="MPESA" id="mpesa" />
                              <Label htmlFor="mpesa" className="flex items-center gap-2">
                                <span className="text-mpesa font-bold">M-PESA</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border rounded-md">
                              <RadioGroupItem value="CASH" id="cash" />
                              <Label htmlFor="cash">Cash on Pickup</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border rounded-md opacity-50">
                              <RadioGroupItem value="CARD" id="card" disabled />
                              <Label htmlFor="card">
                                Card (Visa/Mastercard) - Coming Soon
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.paymentMethod === 'MPESA' && (
                          <div className="bg-mint p-6 rounded-lg space-y-4 border-2 border-mpesa/30">
                            <p className="font-bold text-lg">Send the total amount to the following M-Pesa till number:</p>
                            <div className="text-center py-6 bg-white rounded-lg shadow-md">
                              <p className="text-4xl md:text-5xl font-extrabold text-mpesa tracking-wide">TILL NUMBER 1591045</p>
                            </div>
                            <div className="text-base md:text-lg space-y-2 font-medium">
                              <p><strong>Amount:</strong> {formatCurrency(total)}</p>
                              <p><strong>Business Number:</strong> +254 143 188357</p>
                            </div>
                            <p className="text-base mt-4 font-semibold">
                              After sending the payment, enter the M-Pesa transaction code below to confirm your order.
                            </p>
                            <div>
                              <Label htmlFor="mpesaCode" className="text-base font-semibold">M-Pesa Transaction Code *</Label>
                              <Input
                                id="mpesaCode"
                                name="mpesaCode"
                                placeholder="e.g., QP12345678"
                                value={formData.mpesaCode}
                                onChange={handleInputChange}
                                className="text-lg font-semibold"
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="flex-1"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover"
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'Confirm Payment'}
                          </Button>
                        </div>
                      </form>
                      <p className="text-sm text-muted-foreground mt-4">
                        Your order will be confirmed once we verify your payment. Thank you!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-2xl">
                            🍗
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantityKg} kg × {formatCurrency(item.pricePerKg)}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatCurrency(item.pricePerKg * item.quantityKg)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
