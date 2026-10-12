import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, DollarSign, Truck, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
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

  const products = [
    { id: '1', name: 'Chicken Legs', price: 500, slug: 'chicken-legs' },
    { id: '2', name: 'Boneless', price: 600, slug: 'boneless' },
    { id: '3', name: 'Wings', price: 500, slug: 'wings' },
    { id: '4', name: 'Gizzard', price: 500, slug: 'gizzard' },
    { id: '5', name: 'Drumsticks', price: 580, slug: 'drumsticks' },
    { id: '6', name: 'Chicken Thighs', price: 480, slug: 'chicken-thighs' },
    { id: '7', name: 'Kuku Katakata', price: 240, slug: 'kuku-katakata' },
    { id: '8', name: 'Katakata Without Skin', price: 280, slug: 'katakata-without-skin' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Products</h2>
            <p className="text-sm md:text-base text-muted-foreground">Fresh chicken cuts, great prices.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
                    🍗
                  </div>
                </div>
                <CardContent className="p-3 md:p-4">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">{product.name}</h3>
                  <p className="text-base md:text-lg font-bold text-primary mb-3 md:mb-4">
                    {formatCurrency(product.price)} / kg
                  </p>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover text-sm md:text-base">
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
        <div className="container mx-auto px-4">
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
              <p className="font-semibold text-sm md:text-base">+254 143 188357</p>
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
