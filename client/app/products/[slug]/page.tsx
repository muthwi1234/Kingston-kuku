'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ShoppingCart, MessageCircle, ArrowLeft, Package } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
    fetchSettings();
  }, [params.slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll();
      const foundProduct = res.products.find((p: any) => p.slug === params.slug);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.settings.getAll();
      const settingsObj: any = {};
      res.settings.forEach((s: any) => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product._id || product.id,
      name: product.name,
      pricePerKg: product.pricePerKg,
      imageUrl: product.imageUrl || '',
      quantityKg: quantity,
    });
    toast.success(`${quantity}kg of ${product.name} added to cart`);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const phone = settings?.whatsapp_number || settings?.business_phone || '+254143188357';
    const cleanPhone = phone.replace(/\D/g, '');
    let message = `Hi, I'm interested in ${product.name} (${formatCurrency(product.pricePerKg)}/kg). Can you tell me more?`;
    
    if (product.imageUrl) {
      message += `\n\nProduct: ${product.imageUrl}`;
    }
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-page flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-8">
        <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🍗
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <Badge variant="secondary" className="mb-3">
                    {product.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(product.pricePerKg)} <span className="text-lg font-normal text-muted-foreground">/ kg</span>
                </p>
              </div>

              {product.description && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {product.stockKg > 0 ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Package className="h-4 w-4" />
                  <span>In stock: {product.stockKg}kg available</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-rose-600">
                  <Package className="h-4 w-4" />
                  <span>Out of stock</span>
                </div>
              )}

              <Card className="border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Quantity (kg)
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                        disabled={quantity <= 0.5}
                      >
                        -
                      </Button>
                      <span className="text-lg font-semibold w-16 text-center">
                        {quantity}kg
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stockKg || 100, quantity + 0.5))}
                        disabled={product.stockKg > 0 && quantity >= product.stockKg}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-slate-200">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(product.pricePerKg * quantity)}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stockKg <= 0}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover gap-2"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>

                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="w-full gap-2 border-green-500 text-green-700 hover:bg-green-50"
                      size="lg"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Ask on WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
