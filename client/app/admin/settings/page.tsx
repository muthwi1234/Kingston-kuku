'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Store,
  Phone,
  CreditCard,
  Truck,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    store_name: 'Kingston Chicken',
    contact_phone: '+254 143 188557',
    mpesa_till_number: '1591045',
    delivery_fee: '150',
    minimum_order: '500',
    store_status: 'OPEN',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.settings.getAll();
      if (res.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.settings,
        }));
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.settings.update(key, String(value));
      }
      toast.success('Settings updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Configuration</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Settings</h1>
        </div>

        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Settings */}
        <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <Store className="h-4 w-4 text-primary" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sName">Store Name</Label>
                <Input
                  id="sName"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="mt-1 rounded-xl bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="sPhone">Contact Phone Number</Label>
                <Input
                  id="sPhone"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="mt-1 rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Delivery Settings */}
        <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <Truck className="h-4 w-4 text-primary" />
              Delivery & Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sTill">M-Pesa Till Number</Label>
                <Input
                  id="sTill"
                  value={settings.mpesa_till_number}
                  onChange={(e) => setSettings({ ...settings, mpesa_till_number: e.target.value })}
                  className="mt-1 rounded-xl bg-slate-50 border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <Label htmlFor="sFee">Standard Delivery Fee (Ksh)</Label>
                <Input
                  id="sFee"
                  type="number"
                  value={settings.delivery_fee}
                  onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
                  className="mt-1 rounded-xl bg-slate-50 border-slate-200 font-bold"
                />
              </div>

              <div>
                <Label htmlFor="sMin">Minimum Order Value (Ksh)</Label>
                <Input
                  id="sMin"
                  type="number"
                  value={settings.minimum_order}
                  onChange={(e) => setSettings({ ...settings, minimum_order: e.target.value })}
                  className="mt-1 rounded-xl bg-slate-50 border-slate-200 font-bold"
                />
              </div>

              <div>
                <Label htmlFor="sStatus">Store Operation Status</Label>
                <select
                  id="sStatus"
                  value={settings.store_status}
                  onChange={(e) => setSettings({ ...settings, store_status: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold focus:outline-none"
                >
                  <option value="OPEN">Open (Accepting Orders)</option>
                  <option value="CLOSED">Closed (Maintenance)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover flex items-center gap-2 px-6 h-11 font-bold shadow-sm"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
