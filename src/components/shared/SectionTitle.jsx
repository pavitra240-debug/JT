import React from 'react';
import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className={`font-lexend text-3xl md:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-[#0F172A]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${light ? 'text-white/60' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className={`h-[2px] w-12 ${light ? 'bg-white/30' : 'bg-slate-300'}`} />
        <div className="h-2 w-2 rounded-full bg-amber-500" />
        <div className={`h-[2px] w-12 ${light ? 'bg-white/30' : 'bg-slate-300'}`} />
      </div>
    </motion.div>
  );
}