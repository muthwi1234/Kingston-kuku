import Link from 'next/link';
import { Phone, MapPin, MessageCircle, Instagram, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <span className="text-xl">🐓</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none">KINGSTON</span>
                <span className="text-sm font-bold leading-none text-secondary">CHICKEN</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Fresh Chicken. Quality You Can Taste.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-secondary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+254 143 188357</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/254143188357" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-secondary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-secondary" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@kingston.kuku?_r=1&_t=ZS-9AgTxPc0vhw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-secondary transition-colors"
                >
                  <Share2 className="h-4 w-4 text-secondary" />
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/kingstonkuku?exln=MW1vdDBhY2c0cTAxbg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-secondary transition-colors"
                >
                  <Instagram className="h-4 w-4 text-secondary" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="px-3.5 py-1.5 bg-mpesa rounded-md flex items-center justify-center text-white text-sm font-black tracking-wider whitespace-nowrap shadow-sm">
                  M-PESA
                </div>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">M-PESA Till Number:</p>
                <p className="font-bold text-secondary">1591045</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2026 Kingston Chicken. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Fresh Chicken | Quality | Great Prices
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
