import React from 'react';
import { motion } from 'framer-motion';

export default function PageHero({ label, title, subtitle, image }) {
  return (
    <section className="relative h-[50vh] min-h-[360px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[#0F172A]/70" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        {label && (
          <p className="text-amber-500 font-semibold tracking-[0.2em] uppercase text-sm mb-4">
            {label}
          </p>
        )}
        <h1 className="font-lexend text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}