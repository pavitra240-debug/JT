import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const LOGO_URL = "https://media.base44.com/images/public/user_69dcc1436220b5d44bc0759d/94488379b_tour.jpg";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="Jyothu Travels" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-lexend font-bold text-lg">Jyothu Travels</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Your Map. Your Dream. Our Mission. Premium travel services across Karnataka and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-lexend font-semibold mb-4 text-amber-500">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Travel Packages', path: '/packages' },
                { label: 'Booking', path: '/booking' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/60 hover:text-amber-500 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {import.meta.env.DEV && (
                <Link
                  to="/jyothu-control-panel-login"
                  className="text-white/60 hover:text-amber-500 text-sm transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </nav>
          </div>

          <div>
            <h4 className="font-lexend font-semibold mb-4 text-amber-500">Services</h4>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li>Car Rentals</li>
              <li>Bus & Tempo Traveller</li>
              <li>Travel Packages</li>
              <li>Outstation Trips</li>
              <li>Corporate Travel</li>
            </ul>
          </div>

          <div>
            <h4 className="font-lexend font-semibold mb-4 text-amber-500">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a href="tel:9742100545" className="flex items-start gap-2 hover:text-amber-500 transition-colors">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>9742100545 (WhatsApp/Call)<br />9483868523 (Call)</span>
              </a>
              <a href="mailto:jyothutravelsandtourism@gmail.com" className="flex items-start gap-2 hover:text-amber-500 transition-colors">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>jyothutravelsandtourism@gmail.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>#12, Shetter Layout, Linga Rajnagar, Near Global College, Hubli 580031</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/40">
          <p>© {new Date().getFullYear()} Jyothu Travels and Tourism. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}