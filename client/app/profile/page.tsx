'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Mail, Shield, Package, Calendar, LogOut, ShoppingBag, CreditCard, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      setLoadingOrders(false);
      return;
    }

    if (user) {
      setLoadingOrders(true);
      setOrdersError(null);
      api.orders
        .getMyOrders()
        .then((res) => {
          setOrders(res.orders || []);
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          setOrdersError('Failed to load orders. Please try again.');
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [user, mounted]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Calculate customer stats
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const totalItemsOrdered = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!mounted) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-page py-16 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center p-6">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-6">You need to sign in to view your dashboard and orders.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-page py-8">
        <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.name}! Track your orders and manage your account.</p>
            </div>
            <div className="flex items-center gap-3">
              {user.role?.toUpperCase() === 'ADMIN' && (
                <Link href="/admin">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold flex items-center gap-2 shadow-sm">
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-sky-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{deliveredOrders}</p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="md:col-span-1 shadow-sm h-fit">
              <CardHeader className="bg-muted/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>Member since {new Date().getFullYear()}</p>
                  <p className="mt-1">{totalItemsOrdered} items purchased</p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Recent Orders
                </h2>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-primary hover:underline">
                    Order More →
                  </Button>
                </Link>
              </div>

              {loadingOrders ? (
                <Card className="p-8 text-center text-muted-foreground">Loading your orders...</Card>
              ) : ordersError ? (
                <Card className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                  <h3 className="font-semibold text-lg mb-1">Error loading orders</h3>
                  <p className="text-sm text-muted-foreground mb-4">{ordersError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </Card>
              ) : orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-semibold text-lg mb-1">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here.</p>
                  <Link href="/products">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                      Start Shopping
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order._id || order.id} className="overflow-hidden shadow-sm border border-slate-200">
                      <div className="bg-slate-50 p-4 border-b flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-slate-800">
                            #{String(order._id || order.id).slice(-6).toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </Badge>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2 mb-3">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-700">
                                {item.quantityKg}kg × {item.productName || 'Chicken'}
                              </span>
                              <span className="font-medium">{formatCurrency(item.subtotal || item.pricePerKg * item.quantityKg)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>{formatCurrency(order.subtotal || 0)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Delivery Fee:</span>
                              <span>{formatCurrency(order.deliveryFee)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm font-bold">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Payment: </span>
                              <span>{order.paymentMethod}</span>
                              {order.mpesaCode && <span className="text-xs text-muted-foreground">({order.mpesaCode})</span>}
                              {order.paymentVerified !== undefined && (
                                <Badge variant={order.paymentVerified ? 'default' : 'destructive'} className="text-xs">
                                  {order.paymentVerified ? 'Verified' : 'Pending'}
                                </Badge>
                              )}
                            </div>
                            <span className="text-base text-primary">{formatCurrency(order.total)}</span>
                          </div>
                          {order.deliveryType && (
                            <div className="text-xs text-muted-foreground">
                              {order.deliveryType === 'DELIVERY' 
                                ? `🚚 ${order.deliveryZoneName || 'Delivery'} to: ${order.address}` 
                                : '🏪 Pickup at store'}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
