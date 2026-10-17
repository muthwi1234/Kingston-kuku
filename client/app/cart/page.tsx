'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  
  const subtotal = getSubtotal();
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-page py-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some delicious chicken to get started!</p>
            <Button onClick={() => router.push('/products')}>Browse Products</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Your Cart ({items.length})</h1>
              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded overflow-hidden flex items-center justify-center text-4xl shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>🍗</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatCurrency(item.pricePerKg)} / kg
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantityKg - 0.5)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantityKg} kg
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantityKg + 0.5)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t text-right">
                        <p className="font-bold">
                          {formatCurrency(item.pricePerKg * item.quantityKg)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg">{formatCurrency(total)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      Proceed to Checkout →
                    </Button>
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
