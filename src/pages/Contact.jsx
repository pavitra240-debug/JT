import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { publicApi } from '@/api/backendClient';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';

const HERO_IMG = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/5aea7312e_generated_1ccab50c.png";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['9742100545 (WhatsApp/Call)', '9483868523 (Call)'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['jyothutravelsandtourism@gmail.com'],
  },
  {
    icon: MapPin,
    title: 'Address',
    lines: ['#12, Shetter Layout, Linga Rajnagar,', 'Near Global College, Hubli 580031'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['24/7 Available'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.message.trim()) {
      toast.error('Please fill in required fields: Full Name and Message');
      return;
    }
    setLoading(true);
    await publicApi.createMessage(form);
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ full_name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div>
      <PageHero
        image={HERO_IMG}
        label="Get In Touch"
        title="Contact Us"
        subtitle="Have a question? Need a quote? Reach out to us anytime — we're here to help."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <SectionTitle title="Send a Message" subtitle="" />
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Full Name *</Label>
                  <Input
                    value={form.full_name}
                    onChange={/** @param {React.ChangeEvent<HTMLInputElement>} e */ (e) => setForm({ ...form, full_name: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-medium text-[#0F172A]">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={/** @param {React.ChangeEvent<HTMLInputElement>} e */ (e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#0F172A]">Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={/** @param {React.ChangeEvent<HTMLInputElement>} e */ (e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Subject</Label>
                  <Input
                    value={form.subject}
                    onChange={/** @param {React.ChangeEvent<HTMLInputElement>} e */ (e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Message *</Label>
                  <Textarea
                    value={form.message}
                    onChange={/** @param {React.ChangeEvent<HTMLTextAreaElement>} e */ (e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="mt-1.5 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-bold text-base rounded-full gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <SectionTitle title="Contact Information" subtitle="" />
              <div className="space-y-4 mb-8">
                {CONTACT_INFO.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-lexend font-semibold text-[#0F172A] mb-1">{info.title}</h4>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-slate-500 text-sm">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href="https://wa.me/919742100545"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Chat on WhatsApp</p>
                  <p className="text-green-600 text-sm">Quick replies guaranteed</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 text-sm font-medium">#12, Shetter Layout, Linga Rajnagar, Near Global College, Hubli 580031</span>
            </div>
            <div className="flex gap-3 ml-auto">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=15.3647,75.1415"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-semibold text-sm px-4 py-2 rounded-full transition-colors"
              >
                Get Directions →
              </a>
              <a
                href="https://maps.google.com/?q=Jyothu+Travels+and+Tourism+Linga+Rajnagar+Hubli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
              >
                Open in Maps →
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-[420px]">
            <iframe
              src="https://maps.google.com/maps?q=Jyothu+Travels+and+Tourism+Linga+Rajnagar+Hubli&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jyothu Travels and Tourism Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}