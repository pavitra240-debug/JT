import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, Users, CreditCard, HeadphonesIcon } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const HERO_IMG = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/c04a35459_generated_becb4eaf.png";

const WHY_CHOOSE = [
  { icon: Shield, title: 'Trusted & Reliable', desc: 'Years of experience serving customers across Karnataka with impeccable safety records.' },
  { icon: Clock, title: '24/7 Availability', desc: 'We are available round the clock — book anytime, travel anytime.' },
  { icon: MapPin, title: 'Wide Coverage', desc: 'Local, outstation, and multi-day packages covering all of Karnataka and beyond.' },
  { icon: Users, title: 'All Group Sizes', desc: 'From solo travel to 30+ group outings — we have the right vehicle for everyone.' },
  { icon: CreditCard, title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay. Fair and competitive rates.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', desc: 'Personal attention to every booking with WhatsApp and phone support.' },
];

const TERMS = [
  'All prices are subject to change without prior notice.',
  'Toll charges, parking fees, and permit charges are borne by the customer unless stated otherwise.',
  'For outstation trips, a minimum daily km limit may apply. Extra km will be charged at the per-km rate.',
  'Driver allowance and night charges may apply for multi-day trips.',
  'AC will be provided only on highway stretches for outstation travel unless explicitly booked for full-time AC.',
  'Cancellation charges may apply depending on the notice period.',
  'Luggage capacity is subject to the vehicle type. Excess luggage may require a larger vehicle.',
  'The company is not responsible for delays caused by traffic, weather, or road conditions.',
  'Child seats or special requirements must be mentioned at the time of booking.',
];

const FAQS = [
  { q: 'How do I book a car or bus?', a: 'You can book by calling us at 9742100545, sending a WhatsApp message, or filling out the booking form on our website. We\'ll confirm your booking within minutes.' },
  { q: 'What is the cancellation policy?', a: 'Cancellation charges vary depending on how far in advance you cancel. We recommend cancelling at least 24 hours before the trip for minimal charges. Contact us for specific details.' },
  { q: 'Are your prices inclusive of fuel and driver?', a: 'Yes, all our prices include fuel, driver charges, and basic insurance. Toll, parking, and permit charges are additional unless specified in the package.' },
  { q: 'Do you provide AC vehicles?', a: 'Yes, we offer both AC and Non-AC options for all our vehicles. AC vehicles are available at a slightly higher rate. For outstation, AC is typically provided on highway stretches.' },
  { q: 'Can I customize a tour package?', a: 'Absolutely! We can customize any package based on your requirements — duration, destinations, vehicle type, and budget. Just let us know your preferences.' },
  { q: 'What areas do you serve?', a: 'We primarily serve Hubli-Dharwad and all of North Karnataka. We also cover the entire state including Bangalore, Goa, and neighboring states for outstation trips.' },
];

export default function About() {
  return (
    <div>
      <PageHero
        image={HERO_IMG}
        label="About Us"
        title="Your Trusted Travel Partner"
        subtitle="Since our inception, Jyothu Travels and Tourism has been delivering premium travel experiences from Hubli to destinations across Karnataka and beyond."
      />

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Our Story" subtitle="Built on trust, powered by service" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-slate-600 text-lg leading-relaxed"
          >
            <p>
              Jyothu Travels and Tourism started with a simple mission — to provide safe, comfortable, and affordable
              travel solutions for the people of Hubli and North Karnataka. What began as a small fleet of cars has
              grown into a comprehensive travel service offering sedans, SUVs, tempo travellers, mini buses, and
              curated tour packages.
            </p>
            <p>
              We understand that every journey is important to our customers. That is why we maintain our vehicles to
              the highest standards, hire experienced and courteous drivers, and keep our pricing transparent and
              competitive. Whether it is a quick local drop, a family pilgrimage, or a corporate outing — we treat
              every trip with the same dedication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Why Choose Us" subtitle="What sets Jyothu Travels apart" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-500 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-amber-500 transition-colors duration-500">
                  <item.icon className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-lexend font-bold text-[#0F172A] text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Terms & Conditions" subtitle="Please read before booking" />
          <div className="space-y-4">
            {TERMS.map((term, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 items-start"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-slate-600 text-base leading-relaxed pt-1">{term}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Frequently Asked Questions" subtitle="Got questions? We have answers." />
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white rounded-xl border border-slate-200 px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-lexend font-semibold text-[#0F172A] text-base hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}