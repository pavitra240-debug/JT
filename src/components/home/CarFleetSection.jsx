import React from 'react';
import SectionTitle from '../shared/SectionTitle';
import CarCard from '../cards/CarCard';

export default function CarFleetSection({ cars = [] }) {

  if (cars.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Car Fleet"
          subtitle="Choose from our range of well-maintained cars for local and outstation travel"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}