import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Shield, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGES = [
  "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/cb85fac69_generated_75e9dc6a.png",
  "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/dfd91a2d1_generated_544064ee.png",
  "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/3279c6016_generated_7fe68e84.png",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGES[current]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-2xl"
        >
          <p className="text-amber-500 font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            YOUR MAP. YOUR DREAM. OUR MISSION.
          </p>
          <h1 className="font-lexend text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight">
            Premium Travel
          </h1>
          <h1 className="font-lexend text-5xl md:text-6xl lg:text-7xl font-bold text-amber-500 italic mb-6 leading-tight">
            Across Karnataka
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            From comfortable sedans to luxury buses — we make every journey seamless. Trusted by thousands across Hubli and North Karnataka.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/booking">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-bold text-base gap-2 rounded-full px-8 h-12">
                Book Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="tel:9742100545">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base gap-2 rounded-full px-8 h-12">
                <Phone className="w-4 h-4" /> Call Us
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Trusted & Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>All Karnataka</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === current ? 'w-8 bg-amber-500' : 'w-4 bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}