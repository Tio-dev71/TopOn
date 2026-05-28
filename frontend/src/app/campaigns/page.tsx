'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import CampaignCard from '@/components/campaigns/CampaignCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

const CATEGORIES = ['Tất cả', 'Làm đẹp', 'Du lịch', 'Ẩm thực', 'Lifestyle', 'Công nghệ', 'Thời trang', 'Nhà bếp', 'Giải trí'];
const PLATFORMS = ['Tất cả', 'TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'];
const TYPES = ['Tất cả', 'REVIEW', 'AWARENESS', 'SALES', 'CHECKIN'];

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');

  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', 'list', { search, category, platform, type, page, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        sortBy,
        order: 'desc',
        ...(search && { search }),
        ...(category && category !== 'Tất cả' && { category }),
        ...(platform && platform !== 'Tất cả' && { platform }),
        ...(type && type !== 'Tất cả' && { type }),
      });
      const { data } = await api.get(`/campaigns?${params}`);
      return data;
    },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Khám phá chiến dịch</h1>
            <p className="text-gray-400 text-sm">Tìm và đăng ký chiến dịch phù hợp với lĩnh vực của bạn</p>

            {/* Search */}
            <div className="mt-5 flex gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="search-campaigns"
                  placeholder="Tìm kiếm chiến dịch..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-blue-300 bg-white"
              >
                <option value="createdAt">Mới nhất</option>
                <option value="budgetPerReviewer">Ngân sách cao nhất</option>
                <option value="deadline">Hạn sớm nhất</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 mb-6">
            {/* Category filter */}
            <div className="flex gap-2 flex-shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === 'Tất cả' ? '' : cat); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    (cat === 'Tất cả' && !category) || category === cat
                      ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Platform filter chips */}
          <div className="flex gap-2 mb-6">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => { setPlatform(p === 'Tất cả' ? '' : p); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  (p === 'Tất cả' && !platform) || platform === p
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {p === 'TIKTOK' ? '🎵 TikTok' : p === 'INSTAGRAM' ? '📸 Instagram' : p === 'YOUTUBE' ? '▶️ YouTube' : p === 'FACEBOOK' ? '🔵 Facebook' : p}
              </button>
            ))}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(12)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-lg font-bold text-gray-700 mb-2">Không tìm thấy chiến dịch</h2>
              <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
              <button onClick={() => { setSearch(''); setCategory(''); setPlatform(''); setType(''); }} className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{data?.meta?.total || 0}</span> chiến dịch được tìm thấy
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {data?.data?.map((campaign: any) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>

              {/* Pagination */}
              {data?.meta?.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    Trước
                  </button>
                  {[...Array(data?.meta?.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                        page === i + 1
                          ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(data?.meta?.totalPages, p + 1))}
                    disabled={page === data?.meta?.totalPages}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
