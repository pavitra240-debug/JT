import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/backendClient';
import PageHero from '../components/shared/PageHero';
import SectionTitle from '../components/shared/SectionTitle';
import PackageCard from '../components/cards/PackageCard';

const HERO_IMG = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/dfd91a2d1_generated_544064ee.png";

export default function Packages() {
  const { data, isLoading } = useQuery({
    queryKey: ['packages-page'],
    queryFn: () => publicApi.homeData(),
  });
  const packages = data?.packages || [];

  return (
    <div>
      <PageHero
        image={HERO_IMG}
        label="Explore"
        title="Travel Packages"
        subtitle="Curated tour packages with transparent, all-inclusive pricing for every vehicle type"
      />

      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="All Packages"
            subtitle="Choose from our curated travel experiences"
          />
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No packages available at the moment. Please check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}