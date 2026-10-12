'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  Bell,
  ChartColumnBig,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  PackageCheck,
  Search,
  Settings,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin' },
  { label: 'Orders', icon: ShoppingCart, route: '/admin/orders' },
  { label: 'Products', icon: Package, route: '/admin/products' },
  { label: 'Customers', icon: Users, route: '/admin/customers' },
  { label: 'Reports', icon: ChartColumnBig, route: '/admin/reports' },
  { label: 'Settings', icon: Settings, route: '/admin/settings' },
];

const stats = [
  { label: 'Total Sales', value: 'Ksh 36,750', change: '+12.5%', tone: 'emerald', icon: CircleDollarSign },
  { label: 'Total Orders', value: '23', change: '+8.2%', tone: 'sky', icon: ShoppingCart },
  { label: 'Pending Orders', value: '4', change: '-2.4%', tone: 'amber', icon: WalletCards },
  { label: 'Low Stock', value: '2', change: '+1.3%', tone: 'rose', icon: PackageCheck },
];

const recentOrders = [
  { id: '#1023', customer: 'Samuel N', items: '2x Chicken Legs', amount: 'Ksh 1,200', status: 'Delivered' },
  { id: '#1024', customer: 'Mary W', items: '1x Wings', amount: 'Ksh 650', status: 'Processing' },
  { id: '#1025', customer: 'Peter K', items: '3x Gizzard', amount: 'Ksh 1,800', status: 'Pending' },
  { id: '#1026', customer: 'Jane A', items: '2x Drumsticks', amount: 'Ksh 1,040', status: 'Paid' },
];

const topProducts = [
  { name: 'Chicken Legs', sold: '4.8k', percent: '32%' },
  { name: 'Wings', sold: '3.2k', percent: '24%' },
  { name: 'Gizzard', sold: '2.6k', percent: '18%' },
];

const quickActions = [
  { label: 'Add Product', route: '/admin/products' },
  { label: 'View Orders', route: '/admin/orders' },
  { label: 'Team Access', route: '/admin/customers' },
  { label: 'Export Report', route: '/admin/reports' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleNavigate = (route: string, label: string) => {
    setActiveTab(label);
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-slate-800">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-secondary bg-secondary/10 text-lg font-bold text-secondary">
              K
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">Kingston</p>
              <p className="text-lg font-black tracking-tight">CHICKEN</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a className="text-secondary">Home</a>
            <a className="text-primary-foreground/80">Products</a>
            <a className="text-primary-foreground/80">About Us</a>
            <a className="text-primary-foreground/80">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm md:flex">
              <Search className="h-4 w-4 text-secondary" />
              <span className="text-primary-foreground/80">Search</span>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary">
              Login
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-[#eef0eb] p-5 lg:block">
          <div className="mb-8 mt-3 flex items-center gap-3 rounded-xl bg-primary px-3 py-3 text-primary-foreground shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-black text-primary">
              KC
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">Admin</p>
              <p className="text-sm font-bold">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, route }) => (
              <button
                key={label}
                onClick={() => handleNavigate(route, label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  activeTab === label
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-10 border-t border-slate-200 pt-5">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-white/60">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-5 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Overview</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                April 26, 2025
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, change, tone, icon: Icon }) => (
              <Card key={label} className="border-none bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tone === 'sky' ? 'bg-sky-100 text-sky-700' : tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className={`font-semibold ${tone === 'emerald' ? 'text-emerald-600' : tone === 'sky' ? 'text-sky-600' : tone === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>
                    {change}
                  </span>
                  <span className="text-slate-400">vs last month</span>
                </div>
              </Card>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <Card className="border-none bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                <button
                  onClick={() => handleNavigate('/admin/orders', 'Orders')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Items</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100 text-slate-700">
                        <td className="py-3 font-semibold text-slate-900">{order.id}</td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3">{order.items}</td>
                        <td className="py-3 font-semibold">{order.amount}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : order.status === 'Processing'
                                  ? 'bg-amber-100 text-amber-700'
                                  : order.status === 'Pending'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="border-none bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Best Sellers</h2>
                  <span className="text-sm font-medium text-slate-500">This week</span>
                </div>

                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{product.name}</span>
                        <span className="text-slate-500">{product.sold}</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-2.5 rounded-full ${
                            index === 0
                              ? 'bg-primary'
                              : index === 1
                                ? 'bg-secondary'
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: product.percent }}
                        />
                      </div>
                      <div className="mt-2 text-right text-xs font-semibold text-slate-500">{product.percent}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      onClick={() => handleNavigate(action.route, action.label)}
                      className="h-12 justify-center rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
