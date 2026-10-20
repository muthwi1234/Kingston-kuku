'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, ShoppingCart, Menu, X, User as UserIcon, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const totalItems = mounted
    ? cartItems.reduce((sum, item) => sum + (Number(item.quantityKg) || 0), 0)
    : 0;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setMobileMenuOpen(false);
    router.push('/');
  };

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
              {mounted && user ? (
                <>
                  {user.role?.toUpperCase() === 'ADMIN' && (
                    <Link href="/admin">
                      <Button size="sm" className="bg-secondary text-primary hover:bg-secondary/90 font-bold flex items-center gap-1.5 shadow-sm">
                        <Shield className="h-3.5 w-3.5" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" />
                      {user.name.split(' ')[0]}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-primary-foreground hover:bg-primary-hover"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-hover">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px] bg-white text-slate-900">
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
                    {mounted && user ? (
                      <>
                        <div className="pb-2">
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Signed in as</p>
                          <p className="text-base font-bold text-primary">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        {user.role?.toUpperCase() === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary text-primary font-bold shadow-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Shield className="h-4 w-4" />
                            Admin Dashboard →
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block text-base font-medium hover:text-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Profile & Orders
                        </Link>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-center"
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
