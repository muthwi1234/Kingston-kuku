'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ChartColumnBig,
  Settings,
  LogOut,
  Store,
  User as UserIcon,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin' },
  { label: 'Orders', icon: ShoppingCart, route: '/admin/orders' },
  { label: 'Products', icon: Package, route: '/admin/products' },
  { label: 'Customers', icon: Users, route: '/admin/customers' },
  { label: 'Reports', icon: ChartColumnBig, route: '/admin/reports' },
  { label: 'Settings', icon: Settings, route: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user || !isAdmin) {
        router.push('/auth/login');
      }
    }
  }, [mounted, isLoading, user, isAdmin, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const isActive = (route: string) => {
    if (route === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(route);
  };

  if (!mounted || isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary animate-pulse">
          🐓
        </div>
        <p className="text-sm font-semibold text-slate-600">Verifying administrator access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-secondary bg-secondary/10 text-lg font-bold text-secondary">
                🐓
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Kingston</p>
                <p className="text-lg font-black tracking-tight leading-none">CHICKEN ADMIN</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-primary-foreground hover:bg-white/10 gap-2">
                <Store className="h-4 w-4 text-secondary" />
                Storefront
              </Button>
            </Link>

            {mounted && user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition text-sm cursor-pointer">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium">{user.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/30 text-secondary font-semibold">
                      Admin
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="rounded-full bg-secondary text-primary font-semibold hover:bg-secondary/90">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-[#eef0eb] p-5 lg:flex lg:flex-col justify-between">
          <div>
            <div className="mb-6 mt-1 flex items-center gap-3 rounded-xl bg-primary px-3 py-3 text-primary-foreground shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-black text-primary">
                KC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-secondary">Control</p>
                <p className="text-sm font-bold">Panel</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(({ label, icon: Icon, route }) => {
                const active = isActive(route);
                return (
                  <Link
                    key={label}
                    href={route}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white/60"
            >
              <Store className="h-4 w-4 text-primary" />
              Customer View
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex w-72 flex-col justify-between bg-[#eef0eb] p-5 shadow-xl">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐓</span>
                    <span className="font-bold text-primary">Admin Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-md text-slate-600 hover:bg-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map(({ label, icon: Icon, route }) => {
                    const active = isActive(route);
                    return (
                      <Link
                        key={label}
                        href={route}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-slate-700 hover:bg-white/60'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/60"
                >
                  <Store className="h-4 w-4 text-primary" />
                  Customer Storefront
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
