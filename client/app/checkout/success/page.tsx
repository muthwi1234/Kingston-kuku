'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for your order. Your order is being processed and will be confirmed once we verify your payment.
                </p>
                {orderId && (
                  <p className="text-lg font-semibold mb-8">
                    Order ID: {orderId}
                  </p>
                )}
                <div className="space-y-3">
                  <Button onClick={() => router.push('/')} className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                    Continue Shopping
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
