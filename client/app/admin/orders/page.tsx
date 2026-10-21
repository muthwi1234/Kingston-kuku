'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Truck,
  Package,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_TABS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getAll({
        status: activeStatus,
        search: searchQuery,
      });
      setOrders(res.orders || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.orders.updateStatus(orderId, newStatus);
      toast.success(`Order updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyPayment = async (orderId: string, mpesaCode?: string) => {
    setUpdatingId(orderId);
    try {
      await api.orders.verifyPayment(orderId, mpesaCode);
      toast.success('Payment verified');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to verify payment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      await api.orders.markPaymentVerified(orderId);
      toast.success('Payment marked as verified');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to mark payment as verified');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Management</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Orders</h1>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                activeStatus === status
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, or M-Pesa code..."
              className="pl-9 bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
          <Button type="submit" className="rounded-xl bg-primary text-primary-foreground">
            Search
          </Button>
        </form>
      </Card>

      {/* Orders Table */}
      <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const oId = order._id || order.id;
                  const isUpdating = updatingId === oId;
                  return (
                    <tr key={oId} className="hover:bg-slate-50/70 transition">
                      {/* Order info */}
                      <td className="py-4 align-top font-semibold text-slate-900">
                        <span className="font-mono text-sm block">#{String(oId).slice(-6).toUpperCase()}</span>
                        <span className="text-xs font-normal text-slate-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </span>
                      </td>

                      {/* Customer info */}
                      <td className="py-4 align-top">
                        <p className="font-medium text-slate-900">
                          {order.userId?.name || order.guestName || 'Guest'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.userId?.phone || order.guestPhone || '-'}
                        </p>
                        {order.deliveryType === 'delivery' && (
                          <span className="inline-block mt-1 text-xs text-slate-400 max-w-[180px] truncate" title={order.address}>
                            📍 {order.address}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-4 align-top text-xs text-slate-600 max-w-[200px]">
                        <ul className="space-y-1">
                          {order.items?.map((item: any, i: number) => (
                            <li key={i}>
                              <span className="font-medium text-slate-800">{item.quantityKg}kg</span>{' '}
                              {item.productName || 'Chicken'}
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Payment */}
                      <td className="py-4 align-top text-xs">
                        <span className="font-semibold block">{order.paymentMethod}</span>
                        {order.mpesaCode && (
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 block mt-1 w-fit">
                            {order.mpesaCode}
                          </span>
                        )}
                        <span
                          className={`inline-block mt-1 text-[11px] font-semibold ${
                            order.paymentVerified ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {order.paymentVerified ? '✓ Verified' : '⚠ Unverified'}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 align-top font-bold text-slate-900">
                        {formatCurrency(order.total || 0)}
                      </td>

                      {/* Status */}
                      <td className="py-4 align-top">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
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

                      {/* Actions */}
                      <td className="py-4 align-top text-right space-y-2">
                        {!order.paymentVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => order.paymentMethod === 'MPESA' ? handleVerifyPayment(oId, order.mpesaCode) : handleMarkPaid(oId)}
                            disabled={isUpdating}
                            className="h-8 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 mr-2"
                          >
                            {order.paymentMethod === 'MPESA' ? 'Verify M-Pesa' : 'Mark Paid'}
                          </Button>
                        )}

                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(oId, val)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="h-8 w-[130px] text-xs inline-flex">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
