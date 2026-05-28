'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, DollarSign, Users, MapPin, Share2, Heart, ExternalLink, Flag, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
};

const PLATFORM_COLORS: Record<string, string> = {
  FACEBOOK: 'bg-[#1877F2] text-white',
  INSTAGRAM: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white',
  TIKTOK: 'bg-black text-white',
  YOUTUBE: 'bg-[#FF0000] text-white',
};

export default function CampaignDetailPage() {
  const params = useParams();
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${params.id}`);
      return data.data;
    },
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 pt-8 pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="h-[400px] bg-gray-200 rounded-3xl animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
              <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!campaign) return <div className="text-center py-20">Không tìm thấy chiến dịch</div>;

  const advertiser = campaign.advertiser?.user?.profile || {};
  const companyName = campaign.advertiser?.companyName || advertiser.fullName || 'Thương hiệu';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/campaigns" className="hover:text-blue-600 transition-colors">Chiến dịch</a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{campaign.title}</span>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-md">
            {campaign.coverUrl ? (
              <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-6xl">📢</span>
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                {campaign.type}
              </div>
              {campaign.isFeatured && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-500 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1">
                  🔥 NỔI BẬT
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{campaign.title}</h1>
                
                {/* Categories */}
                {campaign.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {campaign.categories.map((cat: string) => (
                      <span key={cat} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Requirements Grid */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-500" />
                  Yêu cầu công việc
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-1">Nền tảng yêu cầu</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {campaign.platforms?.map((p: string) => (
                        <span key={p} className={`text-xs font-bold px-2 py-1 rounded-md ${PLATFORM_COLORS[p] || 'bg-gray-200'}`}>
                          {PLATFORM_LABELS[p] || p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-1">Mục tiêu chiến dịch</div>
                    <div className="text-sm font-semibold text-gray-900">{campaign.objectives || 'Không có'}</div>
                  </div>
                </div>

                {/* Description */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Chi tiết chiến dịch</h3>
                <div className="prose prose-sm sm:prose-base text-gray-600 max-w-none">
                  {campaign.description.split('\n').map((line: string, i: number) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>

                {campaign.contentRequirements && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">Yêu cầu nội dung (Do & Don'ts)</h3>
                    <div className="prose prose-sm sm:prose-base text-gray-600 max-w-none bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                      {campaign.contentRequirements.split('\n').map((line: string, i: number) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 font-medium mb-1">Ngân sách cho mỗi Reviewer</div>
                  <div className="text-3xl font-black text-blue-600">
                    {campaign.budgetPerReviewer?.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" /> Số lượng cần
                    </div>
                    <div className="font-semibold text-gray-900">{campaign.maxReviewers} người</div>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" /> Hạn đăng ký
                    </div>
                    <div className="font-semibold text-gray-900">
                      {campaign.deadline ? format(new Date(campaign.deadline), 'dd/MM/yyyy') : 'Không có'}
                    </div>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Đăng ký tham gia <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-4 flex justify-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                    <Heart className="w-4 h-4" /> Lưu lại
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                    <Share2 className="w-4 h-4" /> Chia sẻ
                  </button>
                </div>
              </div>

              {/* Brand Info */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Thông tin thương hiệu</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    {campaign.advertiser?.logoUrl ? (
                      <Image src={campaign.advertiser.logoUrl} alt="Logo" width={48} height={48} />
                    ) : (
                      <div className="text-xl font-bold text-gray-400">{companyName[0]}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{companyName}</div>
                    <div className="text-xs text-gray-500">{campaign.advertiser?.industry || 'Chưa cập nhật'}</div>
                  </div>
                </div>
                {campaign.advertiser?.website && (
                  <a href={campaign.advertiser.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-50 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                    Truy cập website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
