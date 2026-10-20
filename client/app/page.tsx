'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, DollarSign, Truck, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  const features = [
    {
      icon: Shield,
      title: 'Fresh & Hygienic',
      description: 'Always fresh, always safe',
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Quality at fair prices',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'To your doorstep',
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'M-Pesa & more',
    },
  ];

  const defaultProducts = [
    { id: '1', name: 'Chicken Legs', pricePerKg: 500, slug: 'chicken-legs' },
    { id: '2', name: 'Boneless', pricePerKg: 600, slug: 'boneless' },
    { id: '3', name: 'Wings', pricePerKg: 500, slug: 'wings' },
    { id: '4', name: 'Gizzard', pricePerKg: 500, slug: 'gizzard' },
    { id: '5', name: 'Drumsticks', pricePerKg: 580, slug: 'drumsticks' },
    { id: '6', name: 'Chicken Thighs', pricePerKg: 480, slug: 'chicken-thighs' },
    { id: '7', name: 'Kuku Katakata', pricePerKg: 240, slug: 'kuku-katakata' },
    { id: '8', name: 'Katakata Without Skin', pricePerKg: 280, slug: 'katakata-without-skin' },
  ];

  useEffect(() => {
    api.products
      .getAll()
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setLiveProducts(res.products.slice(0, 8));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch home products:', err);
      });
  }, []);

  const displayProducts = liveProducts.length > 0 ? liveProducts : defaultProducts;

  const handleAddToCart = (product: any) => {
    const pId = product.id || product._id || product.slug;
    addItem({
      productId: pId,
      name: product.name,
      pricePerKg: product.pricePerKg || product.price,
      imageUrl: product.imageUrl || '',
      quantityKg: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 lg:py-24">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                <span className="block">KINGSTON</span>
                <span className="block text-secondary">CHICKEN</span>
              </h1>
              <p className="text-lg md:text-xl font-medium">
                Fresh Chicken. Quality You Can Taste.
              </p>
              <p className="text-sm md:text-base text-muted-foreground max-w-md">
                We supply the freshest, high-quality chicken cuts at the best prices. Perfect for your family.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-secondary text-primary-foreground hover:bg-secondary/80 text-base md:text-lg">
                  Shop Now →
                </Button>
              </Link>
              <div className="inline-block mt-4 px-4 py-2 bg-primary-foreground/10 rounded-full border border-secondary">
                <span className="text-xs md:text-sm font-semibold text-secondary">FRESH LOCAL CHICKEN</span>
              </div>
            </div>
            <div className="relative h-48 md:h-64 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/20 to-transparent rounded-lg" />
              <div className="relative h-full w-full bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-6xl md:text-8xl">🍗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-8 md:py-12 bg-page">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center border-none shadow-sm">
                <CardContent className="pt-4 md:pt-6">
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 text-primary" />
                  <h3 className="font-semibold mb-1 text-sm md:text-base">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-12 md:py-16 bg-page">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Products</h2>
            <p className="text-sm md:text-base text-muted-foreground">Fresh chicken cuts, great prices.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {displayProducts.map((product) => (
              <Card key={product.id || product._id || product.slug} className="overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                      🍗
                    </div>
                  )}
                </div>
                <CardContent className="p-2 md:p-3 lg:p-4">
                  <h3 className="font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base">{product.name}</h3>
                  <p className="text-sm md:text-base lg:text-lg font-bold text-primary mb-2 md:mb-3 lg:mb-4">
                    {formatCurrency(product.pricePerKg || product.price)} / kg
                  </p>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover text-xs sm:text-sm md:text-base"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link href="/products">
              <Button variant="outline" size="lg" className="text-sm md:text-base">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-secondary">
                <span className="text-xl md:text-2xl">🐓</span>
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Kingston Chicken</p>
                <p className="text-xs md:text-sm text-muted-foreground">Fresh Chicken. Quality You Can Taste.</p>
              </div>
            </div>
            <div className="text-center md:text-right space-y-1 md:space-y-2">
              <p className="font-semibold text-sm md:text-base">+254 143 188557</p>
              <p className="text-xs md:text-sm text-muted-foreground">M-Pesa Till Number: 1591045</p>
              <p className="text-xs md:text-sm">We Deliver to your home or office</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
