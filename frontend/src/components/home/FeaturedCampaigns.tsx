'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CampaignCard from '@/components/campaigns/CampaignCard';
import api from '@/lib/api';

export default function FeaturedCampaigns() {
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns?limit=4&status=ACTIVE&sortBy=createdAt&order=desc');
      return data.data;
    },
  });

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-gray-900">Chiến dịch mới</h2>
          <Link
            href="/campaigns"
            className="flex items-center gap-1 text-[13px] text-gray-400 hover:text-gray-900 transition-colors"
          >
            Xem thêm <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data?.slice(0, 4).map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
