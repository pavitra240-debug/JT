import React from 'react';
import { motion } from 'framer-motion';

export default function Separator({ image, icon, title, subtitle }) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[#0F172A]/80" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <div className="text-5xl mb-6">{icon}</div>
        <h3 className="font-lexend text-2xl md:text-3xl font-bold text-white mb-4">{title}</h3>
        <p className="text-white/70 text-lg leading-relaxed">{subtitle}</p>
      </motion.div>
    </section>
  );
}