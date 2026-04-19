import React from 'react';
import SectionTitle from '../shared/SectionTitle';
import PackageCard from '../cards/PackageCard';

export default function PackageSection({ packages = [] }) {

  if (packages.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Travel Packages"
          subtitle="Complete tour packages with vehicle-wise pricing — pick the one that fits your group and budget"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}