import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, CheckCircle } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import { motion } from 'framer-motion';
import { publicApi } from '@/api/backendClient';

const HERO_IMG = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/33ad67369_generated_bb4cccc3.png";

export default function Booking() {
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: '', service_type: '',
    vehicle_or_package: '', pickup_location: '', drop_location: '',
    travel_date: '', travel_time: '', passengers: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data } = useQuery({
    queryKey: ['home-data'],
    queryFn: () => publicApi.homeData(),
  });
  const cars = data?.cars || [];
  const buses = data?.buses || [];
  const packages = data?.packages || [];

  const getVehicleOptions = () => {
    if (form.service_type === 'Car Rental') return cars.map(c => c.vehicle_name);
    if (form.service_type === 'Bus/Tempo Traveller') return buses.map(b => b.vehicle_name);
    if (form.service_type === 'Travel Package') return packages.map(p => p.package_name);
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.phone.trim() || !form.service_type) {
      toast.error('Please fill in all required fields: Name, Phone, and Service Type');
      return;
    }
    setLoading(true);
    const bookingData = {
      ...form,
      passengers: form.passengers ? parseInt(form.passengers) : undefined,
      status: 'Pending'
    };
    await publicApi.createBooking(bookingData);

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div>
        <PageHero
          image={HERO_IMG}
          label="Book Your Ride"
          title="Booking Enquiry"
          subtitle="Fill in your details and we'll confirm your booking within minutes."
        />
        <section className="py-20 md:py-28 bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center px-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-lexend text-3xl font-bold text-[#0F172A] mb-4">Booking Submitted!</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Thank you for your booking enquiry. Our team will contact you within minutes to confirm your ride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/919742100545" target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-8">
                  WhatsApp Us
                </Button>
              </a>
              <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full px-8 border-slate-300">
                Submit Another
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        image={HERO_IMG}
        label="Book Your Ride"
        title="Booking Enquiry"
        subtitle="Fill in your details and we'll confirm your booking within minutes."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <SectionTitle title="Your Details" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Full Name *</Label>
                  <Input
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Phone Number *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#0F172A]">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5 h-12 border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Service Type *</Label>
                  <Select
                    value={form.service_type}
                    onValueChange={(val) => setForm({ ...form, service_type: val, vehicle_or_package: '' })}
                  >
                    <SelectTrigger className="mt-1.5 h-12 border-slate-200">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car Rental">Car Rental</SelectItem>
                      <SelectItem value="Bus/Tempo Traveller">Bus/Tempo Traveller</SelectItem>
                      <SelectItem value="Travel Package">Travel Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Vehicle / Package</Label>
                  <Select
                    value={form.vehicle_or_package}
                    onValueChange={(val) => setForm({ ...form, vehicle_or_package: val })}
                  >
                    <SelectTrigger className="mt-1.5 h-12 border-slate-200">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVehicleOptions().map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Pickup Location</Label>
                  <Input
                    value={form.pickup_location}
                    onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Drop Location</Label>
                  <Input
                    value={form.drop_location}
                    onChange={(e) => setForm({ ...form, drop_location: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Travel Date</Label>
                  <Input
                    type="date"
                    value={form.travel_date}
                    onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Travel Time</Label>
                  <Input
                    type="time"
                    value={form.travel_time}
                    onChange={(e) => setForm({ ...form, travel_time: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Passengers</Label>
                  <Input
                    type="number"
                    value={form.passengers}
                    onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                    className="mt-1.5 h-12 border-slate-200"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#0F172A]">Additional Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  className="mt-1.5 border-slate-200"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-[#0F172A] font-bold text-base rounded-full gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Booking Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}