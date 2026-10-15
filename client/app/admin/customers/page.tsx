'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getCustomers();
      setCustomers(res.customers || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  const totalUsers = customers.length;
  const adminUsers = customers.filter((c) => c.role === 'ADMIN').length;
  const regularUsers = totalUsers - adminUsers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Directory</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Customers</h1>
        </div>

        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{totalUsers}</p>
        </Card>
        <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customers</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{regularUsers}</p>
        </Card>
        <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Administrators</p>
          <p className="mt-2 text-2xl font-black text-primary">{adminUsers}</p>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or phone number..."
            className="pl-9 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Phone</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Orders</th>
                <th className="pb-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id || customer._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 font-medium text-slate-900 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                        {customer.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold">{customer.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {customer.email}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {customer.phone || '-'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={customer.role === 'ADMIN' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {customer.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
                        {customer.orderCount ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-slate-400">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
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
