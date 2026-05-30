'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, DollarSign, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Campaign {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  budgetPerReviewer: number;
  deadline?: string;
  platforms: string[];
  categories: string[];
  isFeatured?: boolean;
  type: string;
  maxReviewers?: number;
  totalSlots?: number;
  _count?: { applications: number };
  advertiser?: {
    companyName?: string;
    logoUrl?: string;
    user?: { profile?: { fullName?: string; avatarUrl?: string } };
  };
}

const PLATFORM_ICONS: Record<string, string> = {
  FACEBOOK: '🔵',
  INSTAGRAM: '📸',
  TIKTOK: '🎵',
  YOUTUBE: '▶️',
};

const TYPE_COLORS: Record<string, string> = {
  REVIEW: 'bg-purple-100 text-purple-700',
  AWARENESS: 'bg-blue-100 text-blue-700',
  SALES: 'bg-green-100 text-green-700',
  CHECKIN: 'bg-blue-100 text-blue-700',
};

const TYPE_LABELS: Record<string, string> = {
  REVIEW: 'Review',
  AWARENESS: 'Awareness',
  SALES: 'Sales',
  CHECKIN: 'Check-in',
};

export default function CampaignCard({ campaign, featured = false }: { campaign: Campaign; featured?: boolean }) {
  // Try to determine a status/type text like "Tuyển chọn", "Đăng bài" based on type
  const typeText = campaign.type === 'REVIEW' ? 'Đăng bài' : campaign.type === 'CHECKIN' ? 'Check-in' : 'Tuyển chọn';

  return (
    <Link href={`/campaigns/${campaign.id}`} className="block group w-full">
      <div className="flex flex-col w-full">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 mb-2 overflow-hidden rounded-md">
          {campaign.coverUrl ? (
            <Image
              src={campaign.coverUrl}
              alt={campaign.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-50">
              <span className="text-3xl opacity-50">📦</span>
            </div>
          )}

          {/* Top-left platform icons */}
          <div className="absolute top-1 left-1 flex gap-1 z-10">
            {campaign.platforms?.map((p) => (
              <span key={p} className="text-[10px] bg-white/90 rounded-sm w-4 h-4 flex items-center justify-center shadow-sm" title={p}>
                {PLATFORM_ICONS[p] || '📱'}
              </span>
            ))}
          </div>

          {/* Bottom-left Badge */}
          <div className="absolute bottom-0 left-0 bg-[#3f51b5] text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center gap-1 rounded-tr-md">
             <span className="text-[8px]">🎯</span> {typeText}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-[11px] md:text-xs leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {campaign.title}
          </h3>

          {/* Location */}
          <div className="text-[9px] text-gray-400 mb-1">
             Toàn quốc
          </div>

          {/* Applicants */}
          <div className="text-[9px] text-gray-500 mb-1.5">
             Đã ứng tuyển {campaign._count?.applications || 0} / {campaign.maxReviewers ?? campaign.totalSlots ?? 50}
          </div>

          {/* Points/Price */}
          <div className="flex items-center">
             <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                {campaign.budgetPerReviewer ? `${campaign.budgetPerReviewer.toLocaleString('vi-VN')}P` : '0P'}
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
