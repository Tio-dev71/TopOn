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
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Chiến dịch mới</h2>
            <p className="text-sm text-gray-400 mt-1">Những chiến dịch mới nhất đang tuyển reviewer</p>
          </div>
          <Link
            href="/campaigns"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
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
