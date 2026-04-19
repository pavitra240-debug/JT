import React from 'react';
import { motion } from 'framer-motion';
import { Star, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CarCard({ car }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={car.image_url}
          alt={car.vehicle_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-[#0F172A]/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {car.category}
          </span>
        </div>
        {car.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-[#0F172A]">{car.rating}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-lexend text-xl font-bold text-[#0F172A] mb-3">{car.vehicle_name}</h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>Local Drop (Hubli)</span>
          <span className="ml-auto font-bold text-[#0F172A] text-lg">₹{car.local_drop_price?.toLocaleString('en-IN')}</span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Local (8H / 80KM)</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase">Non-AC</p>
              <p className="font-bold text-[#0F172A] text-base">₹{car.local_8h_nonac?.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase">AC</p>
              <p className="font-bold text-[#0F172A] text-base">₹{car.local_8h_ac?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Outstation (Per KM)</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase">Non-AC</p>
              <p className="font-bold text-[#0F172A] text-base">₹{car.outstation_nonac_per_km}/km</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center border border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase">AC</p>
              <p className="font-bold text-[#0F172A] text-base">₹{car.outstation_ac_per_km}/km</p>
            </div>
          </div>
        </div>

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