import React from 'react';
import SectionTitle from '../shared/SectionTitle';
import BusCard from '../cards/BusCard';

export default function BusFleetSection({ buses = [] }) {

  if (buses.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Buses & Tempo Travellers"
          subtitle="Spacious and comfortable vehicles for groups and large parties"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      </div>
    </section>
  );
}