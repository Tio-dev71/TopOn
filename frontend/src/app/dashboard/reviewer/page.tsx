'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Star, Wallet, FileCheck, BarChart2, ArrowRight, Activity, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'text-yellow-600 bg-yellow-50' },
  APPROVED: { label: 'Đã duyệt', color: 'text-green-600 bg-green-50' },
  REJECTED: { label: 'Từ chối', color: 'text-blue-600 bg-blue-50' },
  CHANGES_REQUESTED: { label: 'Yêu cầu sửa', color: 'text-blue-600 bg-blue-50' },
};

export default function ReviewerDashboard() {
  const { user } = useAuthStore();

  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics', 'reviewer-overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/reviewer/overview');
      return data.data;
    },
  });

  const { data: applications } = useQuery({
    queryKey: ['reviewer-campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns/my/applied?limit=5');
      return data.data;
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Xin chào, {user?.profile?.fullName || 'Reviewer'} 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">Đây là tổng quan hoạt động của bạn</p>
            </div>
            <Link
              href="/campaigns"
              id="btn-find-campaigns"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg hover:opacity-90 transition-all"
            >
              Khám phá chiến dịch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: BarChart2, label: 'Chiến dịch tham gia', value: overview?.campaigns?.total, sub: `${overview?.campaigns?.approved || 0} được duyệt`, color: 'bg-gradient-to-br from-blue-500 to-blue-500', href: '/dashboard/reviewer/campaigns' },
              { icon: FileCheck, label: 'Nội dung được duyệt', value: overview?.content?.approved, sub: `Trong ${overview?.content?.total || 0} nội dung`, color: 'bg-gradient-to-br from-green-500 to-emerald-500', href: '/dashboard/reviewer/contents' },
              { icon: Wallet, label: 'Số dư ví', value: `${(overview?.wallet?.balance || 0).toLocaleString('vi-VN')}đ`, sub: 'Tổng thu nhập', color: 'bg-gradient-to-br from-blue-500 to-cyan-500', href: '/dashboard/reviewer/earnings' },
              { icon: Star, label: 'Rating trung bình', value: `${(overview?.rating || 0).toFixed(1)} ⭐`, sub: `${overview?.totalCampaigns || 0} chiến dịch hoàn thành`, color: 'bg-gradient-to-br from-yellow-500 to-blue-500', href: '/dashboard/reviewer/profile' },
            ].map(({ icon: Icon, label, value, sub, color, href }) => (
              <Link key={label} href={href} className="group block">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-0.5">{isLoading ? '...' : (value ?? '0')}</div>
                  <div className="text-sm font-medium text-gray-600">{label}</div>
                  {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                </div>
              </Link>
            ))}
          </div>

          {/* Quick tips banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-3xl p-6 mb-8 text-white flex items-center justify-between">
            <div>
              <div className="font-bold text-lg mb-1">💡 Nâng cao hồ sơ của bạn</div>
              <div className="text-white/80 text-sm">Cập nhật số liệu social, lĩnh vực chuyên môn để nhận nhiều lời mời hơn</div>
            </div>
            <Link href="/dashboard/reviewer/profile" className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Cập nhật ngay
            </Link>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="font-bold text-gray-900">Chiến dịch của tôi</h2>
              </div>
              <Link href="/dashboard/reviewer/campaigns" className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {applications?.length === 0 && (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 font-medium">Bạn chưa đăng ký chiến dịch nào</p>
                  <Link href="/campaigns" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Khám phá chiến dịch
                  </Link>
                </div>
              )}
              {applications?.map((app: any) => {
                const statusInfo = STATUS_MAP[app.status] || { label: app.status, color: 'text-gray-600 bg-gray-50' };
                return (
                  <Link key={app.id} href={`/dashboard/reviewer/campaigns/${app.campaignId}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
                      📢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {app.campaign?.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(app.appliedAt), 'dd/MM/yyyy', { locale: vi })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {app.campaign?.budgetPerReviewer?.toLocaleString('vi-VN')}đ
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
