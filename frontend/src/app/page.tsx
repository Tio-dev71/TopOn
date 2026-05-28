import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryBar from '@/components/home/CategoryBar';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HotCampaigns from '@/components/home/HotCampaigns';
import WhyTopOn from '@/components/home/WhyTopOn';
import HowItWorks from '@/components/home/HowItWorks';
import BlogPreview from '@/components/home/BlogPreview';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryBar />
        <FeaturedCampaigns />
        <HotCampaigns />
        <WhyTopOn />
        <HowItWorks />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
}
