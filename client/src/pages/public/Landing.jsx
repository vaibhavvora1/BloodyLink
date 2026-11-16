import React from 'react';
import HeroSection from '../../components/landing/HeroSection';
import LiveAvailabilityStrip from '../../components/landing/LiveAvailabilityStrip';
import ImpactStats from '../../components/landing/ImpactStats';
import HowItWorks from '../../components/landing/HowItWorks';
import CompatibilityChart from '../../components/landing/CompatibilityChart';
import WhyBloodlink from '../../components/landing/WhyBloodlink';
import CtaBanner from '../../components/landing/CtaBanner';

export default function Landing() {
  return (
    <div className="landing-page">
      <HeroSection />
      <LiveAvailabilityStrip />
      <ImpactStats />
      <HowItWorks />
      <CompatibilityChart />
      <WhyBloodlink />
      <CtaBanner />
    </div>
  );
}
