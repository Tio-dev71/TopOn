'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { BarChart2, Users, FileText, Wallet, Plus, TrendingUp, ArrowRight, Activity, Heart } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';

function StatCard({ icon: Icon, label, value, sublabel, color, href }: any) {
  return (
    <Link href={href || '#'} className="group block">
      <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
        </div>
        <div className="text-2xl font-black text-gray-900 mb-0.5">{value ?? '—'}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {sublabel && <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>}
      </div>
    </Link>
  );
}

export default function AdvertiserDashboard() {
  const { user } = useAuthStore();

  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics', 'advertiser-overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/advertiser/overview');
      return data.data;
    },
  });

  const { data: campaigns } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns/my/created?limit=5');
      return data.data;
    },
  });

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Đang chạy', color: 'text-green-600 bg-green-50' },
    DRAFT: { label: 'Nháp', color: 'text-gray-600 bg-gray-50' },
    PAUSED: { label: 'Tạm dừng', color: 'text-yellow-600 bg-yellow-50' },
    COMPLETED: { label: 'Hoàn thành', color: 'text-blue-600 bg-blue-50' },
    CANCELLED: { label: 'Đã hủy', color: 'text-blue-600 bg-blue-50' },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Xin chào, {user?.profile?.fullName || user?.email?.split('@')[0]} 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">Tổng quan chiến dịch của bạn</p>
            </div>
            <Link
              href="/dashboard/advertiser/campaigns/new"
              id="btn-new-campaign"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Tạo chiến dịch
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={BarChart2}
              label="Tổng chiến dịch"
              value={isLoading ? '...' : overview?.campaigns?.total}
              sublabel={`${overview?.campaigns?.active || 0} đang hoạt động`}
              color="bg-gradient-to-br from-blue-500 to-blue-500"
              href="/dashboard/advertiser/campaigns"
            />
            <StatCard
              icon={Heart}
              label="Reviewer đã lưu"
              value={isLoading ? '...' : overview?.bookmarks || 0}
              sublabel="Trong danh sách ưu thích"
              color="bg-gradient-to-br from-purple-500 to-violet-500"
              href="/dashboard/advertiser/bookmarks"
            />
            <StatCard
              icon={FileText}
              label="Nội dung được duyệt"
              value={isLoading ? '...' : overview?.content?.approved}
              sublabel={`Trong ${overview?.content?.total || 0} nội dung`}
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
              href="/dashboard/advertiser/campaigns"
            />
            <StatCard
              icon={Wallet}
              label="Số dư ví"
              value={isLoading ? '...' : `${(overview?.wallet?.balance || 0).toLocaleString('vi-VN')}đ`}
              sublabel={`${(overview?.wallet?.locked || 0).toLocaleString('vi-VN')}đ đang khóa`}
              color="bg-gradient-to-br from-green-500 to-emerald-500"
              href="/dashboard/advertiser/wallet"
            />
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-gray-900">Chiến dịch gần đây</h2>
              </div>
              <Link href="/dashboard/advertiser/campaigns" className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {campaigns?.length === 0 && (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">📢</div>
                  <p className="text-gray-500 font-medium">Chưa có chiến dịch nào</p>
                  <Link href="/dashboard/advertiser/campaigns/new" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" />
                    Tạo chiến dịch đầu tiên
                  </Link>
                </div>
              )}
              {campaigns?.map((campaign: any) => {
                const statusInfo = STATUS_LABELS[campaign.status] || { label: campaign.status, color: 'text-gray-600 bg-gray-50' };
                return (
                  <Link key={campaign.id} href={`/dashboard/advertiser/campaigns/${campaign.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
                      📢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{campaign.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {campaign._count?.applications || 0} reviewer đã đăng ký
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {campaign.budgetTotal?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
