
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/homepage/Hero';
import Stats from '@/components/homepage/Stats';
import CallToAction from '@/components/homepage/CallToAction';
import FramerMotionLoader from '@/components/homepage/FramerMotionLoader';
import CategorySection from '@/components/homepage/CategorySection';
import FeaturedJobs from '@/components/homepage/FeaturedJobs';
import FeaturedCompanies from '@/components/homepage/FeaturedCompanies';
import WhyChooseUs from '@/components/homepage/WhyChooseUs';

const Index = () => {
  // Load framer-motion asynchronously
  return (
    <Layout>
      <FramerMotionLoader />
      <Hero />
      
      <div className="py-16">
        <div className="container mx-auto px-6">
          <Stats />
          <CategorySection />
          <FeaturedJobs />
          <CallToAction />
          <FeaturedCompanies />
          <WhyChooseUs />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
