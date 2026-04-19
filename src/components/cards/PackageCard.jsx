import React from 'react';
import { motion } from 'framer-motion';
import { Star, Phone, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PackageCard({ pkg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
    >
      <div className="relative overflow-hidden h-48 bg-slate-100">
        {pkg.image_url ? (
          <img
            src={pkg.image_url}
            alt={pkg.package_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 text-sm font-medium">
            Image coming soon
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-amber-500 text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full">
            {pkg.tour_type}
          </span>
        </div>
        {pkg.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-[#0F172A]">{pkg.rating}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-lexend text-xl font-bold text-[#0F172A] mb-2">{pkg.package_name}</h3>

        {pkg.route && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{pkg.route}</span>
          </div>
        )}

        {pkg.duration && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{pkg.duration}</span>
          </div>
        )}

        {pkg.pricing_rows && pkg.pricing_rows.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="text-amber-500">🔥</span> Package Pricing
            </p>
            <div className="space-y-0 rounded-xl border border-slate-100 overflow-hidden">
              {pkg.pricing_rows.map((row, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                    idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  } ${idx > 0 ? 'border-t border-slate-100' : ''}`}
                >
                  <span className="text-slate-600 font-medium">{row.vehicle_type}</span>
                  <span className="font-bold text-[#0F172A] whitespace-nowrap">{row.price_range}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <a href="tel:9742100545" className="flex-1">
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold gap-2 rounded-full">
              <Phone className="w-4 h-4" />
              Call Us
            </Button>
          </a>
          <Link to="/booking" className="flex-1">
            <Button variant="outline" className="w-full rounded-full border-slate-300 text-[#0F172A] font-semibold hover:bg-amber-50 hover:border-amber-500">
              Enquiry
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}