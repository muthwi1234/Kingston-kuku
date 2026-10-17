import Link from 'next/link';
import { ShieldCheck, Truck, Scale, Sparkles, HeartHandshake, Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const highlights = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "100% Farm-Fresh Daily",
      description: "Sourced directly from certified, free-range & grain-fed poultry farms in Kenya. Never stale, never thawed from old stock.",
    },
    {
      icon: <Scale className="h-6 w-6 text-primary" />,
      title: "Honest Digital Weighing",
      description: "Transparent weighing down to the exact gram. What you order is exactly what you get, priced fairly and clearly.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Highest Hygiene Standards",
      description: "Handled in sterile, cold-chain sanitized environments following strict food-safety protocols for your family's health.",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Prompt Nairobi Delivery",
      description: "Quick, temperature-conscious doorstep delivery right to your residence, restaurant, or catering kitchen across Nairobi.",
    },
  ];

  const values = [
    {
      title: "Direct Farm Partnerships",
      description: "We work directly with dedicated Kenyan poultry farmers who uphold humane, ethical rearing standards and natural feeds.",
    },
    {
      title: "Custom Chef-Grade Cuts",
      description: "Whether you need whole birds, succulent drumsticks, wings, skinless breast fillets, or gizzards, we cut to your exact preference.",
    },
    {
      title: "Reliable Community Service",
      description: "Proudly serving Nairobi families, bulk buyers, restaurants, and grill masters with consistent quality and dependable supply.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-primary">
                <Award className="h-3.5 w-3.5" />
                Nairobi's Trusted Poultry Partner
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Fresh Chicken. Honest Weights. Quality You Can Taste.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Kingston Chicken is dedicated to delivering farm-fresh, premium-cut poultry from Kenyan farms directly to your doorstep with guaranteed freshness and safety.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 space-y-20 max-w-5xl">
          {/* Our Story Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
                <HeartHandshake className="h-4 w-4" />
                Our Story
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Born From a Passion for Clean, Reliable, Farm-Fresh Poultry
              </h2>
              <p className="text-slate-600 leading-relaxed">
                For too long, buying fresh chicken in Nairobi meant choosing between uncertain open-air wet markets or overpriced, long-frozen supermarket cuts that lost their tenderness and natural flavor.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Kingston Chicken</strong> was established to change that narrative. We bridge the gap between reputable local poultry farmers and your kitchen. Every bird is processed fresh daily in a clean, hygienic facility where food safety, pristine washing, and cold-chain temperature control are paramount.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you are cooking a Sunday family feast, stocking your home freezer with prime chicken breast fillets, or running a busy restaurant, we ensure you receive top-grade poultry that cooks tender and tastes incredible.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-4">
                The Kingston Difference
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 text-sm">
                    <strong>Zero Indefinite Freezing:</strong> Prepped and dispatched within hours of processing to preserve moisture and tenderness.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 text-sm">
                    <strong>Precision Digital Weighing:</strong> Accurate electronic scales guarantee that you pay strictly for the actual weight delivered.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 text-sm">
                    <strong>Expert Butchers:</strong> Clean, trimmed cuts prepared to eliminate excess fat, bruised bone, or unwanted gristle.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-slate-700 text-sm">
                    <strong>Instant M-PESA Till Checkout:</strong> Simple, transparent mobile payments with Till Number <strong>1591045</strong>.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Our Mission & Values */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
                <Award className="h-4 w-4" />
                Our Mission & Purpose
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Feeding Nairobi With Wholesome, Nourishing Chicken
              </h2>
              <p className="text-slate-600">
                Our mission is to be Nairobi’s foremost poultry brand by maintaining uncompromising hygiene, ethical sourcing, transparent pricing, and dependable doorstep delivery.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((val, idx) => (
                <Card key={idx} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                      0{idx + 1}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{val.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{val.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
                <Clock className="h-4 w-4" />
                Why Choose Kingston Chicken
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Every Order Backed by Our Freshness Promise
              </h2>
              <p className="text-slate-600">
                We believe you deserve total confidence when buying meat for your family and patrons.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-primary to-primary-hover rounded-3xl p-8 md:p-12 text-primary-foreground text-center space-y-6 shadow-md">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to Experience Truly Fresh Poultry?
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto text-base md:text-lg">
              Explore our selection of whole birds, prime breast fillets, drumsticks, and wings. Place your order today for prompt delivery across Nairobi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/products">
                <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-8 shadow">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-bold px-8"
                >
                  Contact Us / WhatsApp
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
