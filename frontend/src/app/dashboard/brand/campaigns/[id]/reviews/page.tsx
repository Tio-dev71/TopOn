'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Search, ChevronDown, Check, X, Eye, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function BrandReviewApprovalPage() {
  const { id: campaignId } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['campaign-applications', campaignId],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${campaignId}/applications`);
      return data.data as any[];
    },
    enabled: !!campaignId,
  });

  const applications = data || [];

  const filteredApplications = applications.filter((app: any) => {
    const name = app.reviewer?.user?.profile?.fullName || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') return matchSearch;
    if (activeTab === 'pending') return matchSearch && app.status === 'PENDING';
    if (activeTab === 'approved') return matchSearch && app.status === 'APPROVED';
    if (activeTab === 'rejected') return matchSearch && app.status === 'REJECTED';
    return matchSearch;
  });

  const updateStatus = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      await api.put(`/campaigns/${campaignId}/applications/${appId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-applications', campaignId] });
    },
  });

  const pendingCount = applications.filter((a: any) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a: any) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a: any) => a.status === 'REJECTED').length;

  const TABS = [
    { key: 'all', label: `Tất cả (${applications.length})` },
    { key: 'pending', label: `Chưa duyệt (${pendingCount})` },
    { key: 'approved', label: `Đã duyệt (${approvedCount})` },
    { key: 'rejected', label: `Đã từ chối (${rejectedCount})` },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
          <Link href="/dashboard/brand/campaigns" className="hover:text-gray-900">Quản lý chiến dịch</Link>
          <span>&gt;</span>
          <Link href={`/dashboard/brand/campaigns/${campaignId}`} className="hover:text-gray-900">Chi tiết</Link>
          <span>&gt;</span>
          <span className="text-gray-900">Duyệt nội dung review</span>
        </div>
      </div>

      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-6 text-[11px] font-bold overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 ${activeTab === tab.key ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm reviewer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-[11px] border border-gray-200 rounded focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">Sắp xếp:</span>
            <button className="flex items-center gap-2 text-[11px] font-bold text-gray-700 px-3 py-1.5 border border-gray-200 rounded bg-white">
              Mới nhất <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563eb]" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredApplications.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <div className="text-[12px] font-bold mb-1">Chưa có nội dung nào</div>
            <div className="text-[11px]">Reviewer chưa nộp bài review cho chiến dịch này.</div>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((app: any) => {
            const reviewer = app.reviewer;
            const profile = reviewer?.user?.profile;
            const name = profile?.fullName || 'Reviewer';
            const avatar = profile?.avatarUrl;
            const contents = app.contents || [];
            const latestContent = contents[0];

            return (
              <div key={app.id} className="border border-gray-100 rounded-lg p-5 bg-white flex gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative bg-gray-100 border border-gray-200">
                  {avatar ? (
                    <Image src={avatar} alt={name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[12px] font-bold text-gray-900 flex items-center gap-1">
                        {name}
                        <span className="w-3 h-3 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-[8px]">✓</span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {app.status === 'PENDING' ? 'Đang chờ duyệt' :
                         app.status === 'APPROVED' ? '✅ Đã duyệt' :
                         app.status === 'REJECTED' ? '❌ Đã từ chối' : app.status}
                        {' • '}
                        {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus.mutate({ appId: app.id, status: 'APPROVED' })}
                          disabled={updateStatus.isPending}
                          className="px-4 py-1.5 bg-[#2563eb] text-white font-bold text-[10px] rounded flex items-center gap-1 hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Duyệt
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ appId: app.id, status: 'REJECTED' })}
                          disabled={updateStatus.isPending}
                          className="px-4 py-1.5 border border-gray-200 text-gray-600 font-bold text-[10px] rounded flex items-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3 h-3" /> Từ chối
                        </button>
                      </div>
                    )}

                    {app.status !== 'PENDING' && (
                      <Link
                        href={`/dashboard/brand/campaigns/${campaignId}/applications/${app.id}`}
                        className="px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {latestContent ? (
                    <>
                      <div className="text-[11px] text-gray-700 mb-3 whitespace-pre-line leading-relaxed">
                        {latestContent.caption || latestContent.description}
                      </div>
                      {latestContent.contentUrl && (
                        <a href={latestContent.contentUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#3f51b5] hover:underline mb-3 inline-block font-bold">
                          🔗 {latestContent.contentUrl}
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic mb-3">
                      {app.note || 'Reviewer chưa nộp nội dung.'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
