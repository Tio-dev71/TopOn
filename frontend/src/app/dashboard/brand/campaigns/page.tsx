'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, ChevronLeft, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const STATUS_MAP: Record<string, string> = {
  ACTIVE: 'Đang chạy',
  PENDING: 'Chờ duyệt',
  DRAFT: 'Nháp',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const TAB_STATUS: Record<string, string | null> = {
  'Tất cả': null,
  'Đang chạy': 'ACTIVE',
  'Chờ duyệt': 'PENDING',
  'Nháp': 'DRAFT',
  'Hoàn thành': 'COMPLETED',
};

export default function BrandCampaignsPage() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [page, setPage] = useState(1);

  const statusFilter = TAB_STATUS[activeTab];

  const { data, isLoading } = useQuery({
    queryKey: ['brand-campaigns', activeTab, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/campaigns/my/created', { params });
      return data;
    },
  });

  const campaigns = data?.data || [];
  const meta = data?.meta;

  const TABS = ['Tất cả', 'Đang chạy', 'Chờ duyệt', 'Nháp', 'Hoàn thành'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <h2 className="text-[15px] font-bold text-gray-900">
          Quản lý chiến dịch
        </h2>
        <Link
          href="/dashboard/brand/campaigns/create"
          className="px-6 py-1.5 bg-[#2563eb] text-white font-bold text-[10px] rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-3 h-3" /> Tạo chiến dịch mới
        </Link>
      </div>

      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-6 text-[11px] font-bold overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`pb-2 ${activeTab === tab ? 'text-[#3f51b5] border-b-2 border-[#3f51b5]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="flex text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-2 mb-4 text-center px-4">
          <div className="flex-1 text-left">Chiến dịch</div>
          <div className="w-24">Đăng ký</div>
          <div className="w-32">Trạng thái</div>
          <div className="w-24">Thời hạn</div>
          <div className="w-12"></div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563eb]" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && campaigns.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-[12px] font-bold mb-1">Chưa có chiến dịch nào</div>
            <div className="text-[11px]">Hãy tạo chiến dịch đầu tiên của bạn!</div>
          </div>
        )}

        {/* Table Body */}
        <div className="space-y-4">
          {campaigns.map((campaign: any) => (
            <div key={campaign.id} className="flex items-center border border-gray-100 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
              {/* Campaign Info */}
              <div className="flex-1 flex gap-4">
                <div className="w-16 h-16 rounded bg-gray-100 shrink-0 relative overflow-hidden">
                  {campaign.coverUrl ? (
                    <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📢</div>
                  )}
                </div>
                <div>
                  <Link href={`/dashboard/brand/campaigns/${campaign.id}`} className="text-[11px] font-bold text-gray-900 hover:text-[#3f51b5] mb-1 line-clamp-1">
                    {campaign.title}
                  </Link>
                  <div className="text-[9px] text-gray-500 mb-2 flex items-center gap-1">
                    <span>{campaign.categories?.[0] || 'Chưa phân loại'}</span>
                  </div>
                  <div className="flex gap-1">
                    {(campaign.platforms || []).map((p: string) => (
                      <span key={p} className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Registered */}
              <div className="w-24 text-center text-[10px] font-bold text-gray-600">
                <span className="text-[#3f51b5]">{campaign._count?.applications || 0}</span>
                {campaign.maxReviewers ? ` / ${campaign.maxReviewers}` : ''}
              </div>

              {/* Status */}
              <div className="w-32 text-center">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  campaign.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                  campaign.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                  campaign.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {STATUS_MAP[campaign.status] || campaign.status}
                </span>
              </div>

              {/* Deadline */}
              <div className="w-24 text-center text-[10px] text-gray-500">
                {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('vi-VN') : '—'}
              </div>

              {/* Actions */}
              <div className="w-12 flex justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-[#3f51b5] px-2 py-1 bg-blue-50 rounded">{page}</span>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
