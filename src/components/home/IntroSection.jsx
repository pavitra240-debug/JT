import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../shared/SectionTitle';

export default function IntroSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-amber-500 font-semibold text-sm tracking-wider uppercase mb-2"
        >
          Welcome to
        </motion.p>
        <SectionTitle title="Jyothu Travels & Tourism" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto"
        >
          Based in Hubli, Karnataka — we are your trusted travel partner for local and outstation trips. 
          Whether you need a comfortable sedan for a city ride, a spacious bus for group travel, or a 
          complete tour package — we've got you covered with transparent pricing and reliable service.
        </motion.p>
      </div>
    </section>
  );
}