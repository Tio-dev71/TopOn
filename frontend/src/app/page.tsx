import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryBar from '@/components/home/CategoryBar';
import FeaturedCampaigns from '@/components/home/FeaturedCampaigns';
import HotCampaigns from '@/components/home/HotCampaigns';
import BlogPreview from '@/components/home/BlogPreview';
import BestReviews from '@/components/home/BestReviews';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryBar />
        <FeaturedCampaigns />
        <HotCampaigns />
        <BlogPreview />
        <BestReviews />
      </main>
      <Footer />
    </>
  );
}
