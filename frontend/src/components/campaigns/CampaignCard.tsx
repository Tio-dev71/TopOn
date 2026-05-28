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
  const advertiserName = campaign.advertiser?.companyName ||
    campaign.advertiser?.user?.profile?.fullName || 'Thương hiệu';

  return (
    <Link href={`/campaigns/${campaign.id}`} className="block group">
      <div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5 ${featured ? 'ring-2 ring-blue-100' : ''}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          {campaign.coverUrl ? (
            <Image
              src={campaign.coverUrl}
              alt={campaign.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-50">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {/* Featured badge */}
          {campaign.isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              🔥 NỔI BẬT
            </div>
          )}

          {/* Type badge */}
          <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${TYPE_COLORS[campaign.type] || 'bg-gray-100 text-gray-700'}`}>
            {TYPE_LABELS[campaign.type] || campaign.type}
          </div>

          {/* Platforms */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {campaign.platforms?.map((p) => (
              <span key={p} className="text-sm" title={p}>{PLATFORM_ICONS[p] || p}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Advertiser */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {advertiserName[0]}
            </div>
            <span className="text-xs text-gray-500 truncate">{advertiserName}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {campaign.title}
          </h3>

          {/* Budget */}
          <div className="flex items-center gap-1.5 mb-3">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-blue-600">
              {campaign.budgetPerReviewer?.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs text-gray-400">/ reviewer</span>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {campaign.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hạn: {format(new Date(campaign.deadline), 'dd/MM', { locale: vi })}</span>
              </div>
            )}
            {campaign._count && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{campaign._count.applications} đã đăng ký</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {campaign.categories?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-gray-50">
              {campaign.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
