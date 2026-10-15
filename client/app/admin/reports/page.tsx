'use client';

import { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  CircleDollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>({ totalSales: 0, totalOrders: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.allSettled([
        api.admin.getStats(),
        api.orders.getAll(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = async () => {
    setDownloading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const searchParams = new URLSearchParams();
      if (dateRange.startDate) searchParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) searchParams.append('endDate', dateRange.endDate);

      const res = await fetch(`${API_URL}/api/admin/reports/sales?${searchParams.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to download CSV report');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Report downloaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    } finally {
      setDownloading(false);
    }
  };

  const mpesaCount = orders.filter((o) => o.paymentMethod === 'MPESA').length;
  const cashCount = orders.filter((o) => o.paymentMethod === 'CASH').length;
  const avgOrderValue =
    orders.length > 0
      ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Analytics</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Reports</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
          <Button
            onClick={handleExportCSV}
            disabled={downloading}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover flex items-center gap-2 shadow-sm"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Exporting...' : 'Export CSV Report'}
          </Button>
        </div>
      </div>

      {/* Date Filter Card */}
      <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <Label htmlFor="start" className="text-xs font-semibold text-slate-500">
              Start Date
            </Label>
            <Input
              id="start"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="mt-1 rounded-xl bg-slate-50 border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="end" className="text-xs font-semibold text-slate-500">
              End Date
            </Label>
            <Input
              id="end"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="mt-1 rounded-xl bg-slate-50 border-slate-200"
            />
          </div>
          <div>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={downloading}
              className="w-full rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Download for Date Range
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(stats.totalSales || 0)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalOrders || 0}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Order Value</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatCurrency(Math.round(avgOrderValue))}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payment Breakdown</p>
              <p className="mt-2 text-sm font-bold text-slate-800">
                M-Pesa: {mpesaCount} | Cash: {cashCount}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders Breakdown */}
      <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Transaction Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 15).map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-mono font-semibold text-slate-900">
                      #{String(order._id || order.id).slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 text-xs text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 font-medium">
                      {order.userId?.name || order.guestName || 'Customer'}
                    </td>
                    <td className="py-3 text-xs">
                      <span className="font-semibold">{order.paymentMethod}</span>
                      {order.mpesaCode && <span className="ml-1 text-slate-400 font-mono">({order.mpesaCode})</span>}
                    </td>
                    <td className="py-3 font-bold text-slate-900">{formatCurrency(order.total || 0)}</td>
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
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
