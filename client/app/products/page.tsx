'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
    fetchData(category);
  }, [searchParams]);

  const fetchData = async (category: string) => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.getAll({ category }),
        api.categories.getAll(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    fetchData(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      api.products.getAll({ search: searchQuery }).then((res) => {
        setProducts(res.products || []);
      });
    } else {
      fetchData(selectedCategory);
    }
  };

  const handleAddToCart = (product: any) => {
    const pId = product.id || product._id;
    if (!pId) return;
    addItem({
      productId: pId,
      name: product.name,
      pricePerKg: product.pricePerKg,
      imageUrl: product.imageUrl || '',
      quantityKg: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">Fresh chicken cuts, great prices.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-20 lg:top-24">
                <h2 className="font-semibold mb-4 text-lg">Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                        selectedCategory === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                          selectedCategory === category.slug
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted animate-pulse mb-2" />
                        <div className="h-6 bg-muted animate-pulse mb-4" />
                        <div className="h-10 bg-muted animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <Card key={product.id || product._id} className="overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl">
                          🍗
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">{product.name}</h3>
                        <p className="text-base sm:text-lg font-bold text-primary mb-4">
                          {formatCurrency(product.pricePerKg)} / kg
                        </p>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover text-sm sm:text-base"
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {products.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found.</p>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
