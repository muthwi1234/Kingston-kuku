'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  CircleDollarSign,
  PackageCheck,
  ShoppingCart,
  WalletCards,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>({
    totalSales: 36750,
    totalOrders: 23,
    pendingOrders: 4,
    lowStockProducts: 2,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.allSettled([
        api.admin.getStats(),
        api.orders.getAll(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStatsData(statsRes.value);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
        setRecentOrders(ordersRes.value.orders.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: 'Total Sales',
      value: formatCurrency(statsData.totalSales || 0),
      change: '+12.5%',
      tone: 'emerald',
      icon: CircleDollarSign,
    },
    {
      label: 'Total Orders',
      value: String(statsData.totalOrders ?? 0),
      change: '+8.2%',
      tone: 'sky',
      icon: ShoppingCart,
    },
    {
      label: 'Pending Orders',
      value: String(statsData.pendingOrders ?? 0),
      change: statsData.pendingOrders > 0 ? 'Needs action' : 'All clear',
      tone: statsData.pendingOrders > 0 ? 'amber' : 'emerald',
      icon: WalletCards,
    },
    {
      label: 'Low Stock Items',
      value: String(statsData.lowStockProducts ?? 0),
      change: statsData.lowStockProducts > 0 ? 'Restock needed' : 'Healthy',
      tone: statsData.lowStockProducts > 0 ? 'rose' : 'emerald',
      icon: PackageCheck,
    },
  ];

  const topProducts = [
    { name: 'Chicken Legs', sold: '4.8k kg', percent: '42%' },
    { name: 'Wings', sold: '3.2k kg', percent: '28%' },
    { name: 'Gizzard', sold: '2.6k kg', percent: '18%' },
    { name: 'Boneless Breast', sold: '1.4k kg', percent: '12%' },
  ];

  const quickActions = [
    { label: 'Add Product', route: '/admin/products' },
    { label: 'View Orders', route: '/admin/orders' },
    { label: 'Customers', route: '/admin/customers' },
    { label: 'Export Report', route: '/admin/reports' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Overview</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            {todayStr}
          </span>
          <button
            onClick={fetchDashboardData}
            title="Refresh stats"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, tone, icon: Icon }) => (
          <Card key={label} className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{value}</p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  tone === 'emerald'
                    ? 'bg-emerald-100 text-emerald-700'
                    : tone === 'sky'
                      ? 'bg-sky-100 text-sky-700'
                      : tone === 'amber'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs sm:text-sm">
              <span
                className={`font-semibold ${
                  tone === 'emerald'
                    ? 'text-emerald-600'
                    : tone === 'sky'
                      ? 'text-sky-600'
                      : tone === 'amber'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                }`}
              >
                {change}
              </span>
              <span className="text-slate-400">status</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Main Grid: Recent Orders & Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-semibold text-slate-900">
                        #{String(order._id || order.id).slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3">
                        {order.userId?.name || order.guestName || 'Customer'}
                      </td>
                      <td className="py-3 text-xs text-slate-500 max-w-[150px] truncate">
                        {order.items?.map((i: any) => `${i.quantityKg}kg ${i.productName || 'Chicken'}`).join(', ') || '-'}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {formatCurrency(order.total || 0)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'CONFIRMED' || order.status === 'PROCESSING'
                                ? 'bg-sky-100 text-sky-700'
                                : order.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Best Sellers & Quick Actions */}
        <div className="space-y-6">
          <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Best Sellers</h2>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Popular</span>
            </div>

            <div className="space-y-3.5">
              {topProducts.map((product, index) => (
                <div key={product.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{product.name}</span>
                    <span className="text-xs font-medium text-slate-500">{product.sold}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? 'bg-primary'
                          : index === 1
                            ? 'bg-secondary'
                            : index === 2
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                      }`}
                      style={{ width: product.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  onClick={() => router.push(action.route)}
                  className="h-11 justify-center rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary transition"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
