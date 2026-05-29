'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, DollarSign, Flame } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PLATFORM_ICONS: Record<string, string> = {
  FACEBOOK: '🔵',
  INSTAGRAM: '📸',
  TIKTOK: '🎵',
  YOUTUBE: '▶️',
};

function HotCampaignCard({ campaign }: { campaign: any }) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="block group">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          {campaign.coverUrl ? (
            <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-500 opacity-10" />
          )}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />
            NỔI BẬT
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {campaign.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-blue-500" />
              <span className="font-semibold text-blue-600">{campaign.budgetPerReviewer?.toLocaleString('vi-VN')}đ</span>
            </span>
            {campaign.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(campaign.deadline), 'dd/MM/yyyy', { locale: vi })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {campaign.platforms?.map((p: string) => (
                <span key={p} className="text-sm">{PLATFORM_ICONS[p]}</span>
              ))}
            </div>
            <span className="text-xs font-semibold text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              Xem chi tiết
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HotCampaigns() {
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', 'hot'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns?limit=3&status=ACTIVE');
      return data.data;
    },
  });

  return (
    <section className="py-14 bg-gray-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-gray-900">Chiến dịch nổi bật</h2>
          <Link href="/campaigns?featured=true" className="flex items-center gap-1 text-[13px] text-gray-400 hover:text-gray-900">
            Xem thêm <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data?.slice(0, 4).map((campaign: any) => (
              <HotCampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
