'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });
      if (res.user) {
        setUser(res.user);
      }
      toast.success('Login successful!');
      const isAdmin = res.user?.role?.toUpperCase() === 'ADMIN';
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-12 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
                <p className="text-center mt-4 text-sm">
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
