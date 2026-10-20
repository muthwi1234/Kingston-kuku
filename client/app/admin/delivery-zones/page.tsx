'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    deliveryFee: '',
    areas: '',
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await api.deliveryZones.getAll();
      setZones(res.zones || []);
    } catch (error) {
      toast.error('Failed to load delivery zones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        deliveryFee: parseFloat(formData.deliveryFee),
        areas: formData.areas.split(',').map((a: string) => a.trim()).filter((a: string) => a),
      };

      if (editingZone) {
        await api.deliveryZones.update(editingZone._id, data);
        toast.success('Delivery zone updated');
      } else {
        await api.deliveryZones.create(data);
        toast.success('Delivery zone created');
      }

      setShowModal(false);
      setEditingZone(null);
      setFormData({ name: '', deliveryFee: '', areas: '' });
      fetchZones();
    } catch (error) {
      toast.error('Failed to save delivery zone');
    }
  };

  const handleEdit = (zone: any) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      deliveryFee: zone.deliveryFee.toString(),
      areas: zone.areas.join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery zone?')) return;
    
    try {
      await api.deliveryZones.delete(id);
      toast.success('Delivery zone deleted');
      fetchZones();
    } catch (error) {
      toast.error('Failed to delete delivery zone');
    }
  };

  const openCreateModal = () => {
    setEditingZone(null);
    setFormData({ name: '', deliveryFee: '', areas: '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Zones</h1>
          <p className="text-muted-foreground">Manage delivery areas and fees</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Zone
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <Card key={zone._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {zone.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(zone)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(zone._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee:</span>
                    <span className="font-bold text-primary">{formatCurrency(zone.deliveryFee)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Areas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {zone.areas.map((area: string, idx: number) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{editingZone ? 'Edit' : 'Add'} Delivery Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Zone Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryFee">Delivery Fee (KSh) *</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="areas">Areas (comma-separated) *</Label>
                  <Input
                    id="areas"
                    value={formData.areas}
                    onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                    placeholder="Nairobi CBD, Westlands, Parklands"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingZone ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
