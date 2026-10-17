'use client';

import { useState } from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.contact.sendMessage(formData);
      toast.success('Message sent successfully! We will contact you shortly.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-page py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800">Phone & Call Orders</p>
                      <a href="tel:+254143188357" className="text-primary hover:underline font-medium">
                        +254 143 188357
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800">WhatsApp</p>
                      <a
                        href="https://wa.me/254143188357"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline font-medium"
                      >
                        Chat with us on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800">Location</p>
                      <span className="text-slate-600">Nairobi, Kenya</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                      M-PESA Till Payment
                    </p>
                    <p className="text-sm text-emerald-950 font-bold">
                      Till Number: <span className="text-lg text-emerald-700">1591045</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mary Wanjiku"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone / WhatsApp Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 712 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
                        placeholder="Tell us what cuts or quantities you need, delivery address, or questions..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
