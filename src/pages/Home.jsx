import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/backendClient';
import HeroSection from '../components/home/HeroSection';
import IntroSection from '../components/home/IntroSection';
import CarFleetSection from '../components/home/CarFleetSection';
import BusFleetSection from '../components/home/BusFleetSection';
import PackageSection from '../components/home/PackageSection';
import Separator from '../components/shared/Separator';

const SEP_IMG_1 = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/9c5728094_generated_fc05f5aa.png";
const SEP_IMG_2 = "https://media.base44.com/images/public/69de0d5dc2462520482a09b4/76dce17f8_generated_c95a18d8.png";

export default function Home() {
  const { data } = useQuery({
    queryKey: ['home-data'],
    queryFn: () => publicApi.homeData(),
  });

  return (
    <div>
      <HeroSection />
      <IntroSection />
      <CarFleetSection cars={data?.cars} />
      <Separator
        image={SEP_IMG_1}
        icon="🚌"
        title="Group Travel Made Easy"
        subtitle="From 14-seater tempo travellers to 30-seater mini buses — perfect for weddings, pilgrimages, and corporate outings"
      />
      <BusFleetSection buses={data?.buses} />
      <Separator
        image={SEP_IMG_2}
        icon="🗺️"
        title="Explore Karnataka & Beyond"
        subtitle="Curated travel packages with transparent, all-inclusive pricing for every vehicle type"
      />
      <PackageSection packages={data?.packages} />
    </div>
  );
}