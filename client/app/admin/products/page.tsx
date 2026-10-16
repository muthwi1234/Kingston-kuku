'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    pricePerKg: '',
    stockKg: '',
    categoryId: '',
    imageUrl: '',
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      pricePerKg: '',
      stockKg: '50',
      categoryId: categories[0]?._id || categories[0]?.id || '',
      imageUrl: '',
      isActive: true,
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      pricePerKg: String(product.pricePerKg),
      stockKg: String(product.stockKg || 0),
      categoryId: product.categoryId?._id || product.categoryId?.id || product.categoryId || '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive ?? true,
    });
    setImagePreview(product.imageUrl || null);
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll use a local preview and store the file as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pricePerKg || !formData.categoryId) {
      toast.error('Please fill in required fields (Name, Price, Category)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        pricePerKg: Number(formData.pricePerKg),
        stockKg: Number(formData.stockKg),
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      };

      if (editingProduct) {
        const pId = editingProduct._id || editingProduct.id;
        await api.products.update(pId, payload);
        toast.success('Product updated successfully');
      } else {
        await api.products.create(payload);
        toast.success('Product created successfully');
      }

      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete ${productName}?`)) return;

    try {
      await api.products.delete(productId);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== productId && p.id !== productId));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      p.categoryId?.slug === selectedCategory ||
      p.categoryId?._id === selectedCategory ||
      p.categoryId === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Inventory</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Products</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
          <Button
            onClick={openCreateModal}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-slate-200/80 bg-white p-4 shadow-sm rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or slug..."
            className="pl-9 bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl bg-slate-50 border-slate-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id || c.id} value={c.slug || c._id || c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Products Table */}
      <Card className="border border-slate-200/80 bg-white p-5 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price / kg</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const pId = product._id || product.id;
                  const isLowStock = (product.stockKg || 0) < 20;
                  return (
                    <tr key={pId} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-medium text-slate-900 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">🍗</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.slug}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600">
                        {product.categoryId?.name || 'General'}
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        {formatCurrency(product.pricePerKg)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-semibold ${
                            isLowStock ? 'text-rose-600 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {product.stockKg || 0} kg
                        </span>
                        {isLowStock && (
                          <span className="block text-[11px] text-rose-500 font-medium">Low Stock</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            product.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(product)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(pId, product.name)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pName">Product Name *</Label>
              <Input
                id="pName"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Chicken Drumsticks"
                required
              />
            </div>

            <div>
              <Label htmlFor="pSlug">Slug *</Label>
              <Input
                id="pSlug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="chicken-drumsticks"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pPrice">Price per Kg (Ksh) *</Label>
                <Input
                  id="pPrice"
                  type="number"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                  placeholder="550"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pStock">Stock (Kg) *</Label>
                <Input
                  id="pStock"
                  type="number"
                  value={formData.stockKg}
                  onChange={(e) => setFormData({ ...formData, stockKg: e.target.value })}
                  placeholder="50"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pDesc">Description</Label>
              <Input
                id="pDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Fresh tender cuts..."
              />
            </div>

            <div>
              <Label htmlFor="pImage">Product Image</Label>
              <div className="mt-2">
                <Input
                  id="pImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: '' });
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
