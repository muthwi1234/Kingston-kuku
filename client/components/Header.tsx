'use client';

import Link from 'next/link';
import { Phone, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantityKg, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <span className="text-xl">🐓</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none">KINGSTON</span>
              <span className="text-sm font-bold leading-none text-secondary">CHICKEN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a
              href="tel:+254143188557"
              className="hidden md:flex items-center space-x-2 text-sm hover:text-secondary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">+254 143 188557</span>
            </a>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-hover">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-secondary text-primary-foreground hover:bg-secondary/80">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-hover">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href="tel:+254143188557"
                    className="flex items-center space-x-2 text-lg font-medium hover:text-secondary transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>+254 143 188557</span>
                  </a>
                  <div className="border-t border-primary-foreground/20 pt-4 space-y-3">
                    <Link
                      href="/auth/login"
                      className="block text-lg font-medium hover:text-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-secondary text-primary-foreground hover:bg-secondary/80">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
