'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
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
      <main className="min-h-screen bg-white pb-20">
        {/* Sub-navbar / Filters Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
              
              {/* Left menus */}
              <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                 <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-2">
                    <span className="w-4 h-4 flex flex-col justify-between">
                       <span className="w-full h-0.5 bg-current"></span>
                       <span className="w-full h-0.5 bg-current"></span>
                       <span className="w-full h-0.5 bg-current"></span>
                    </span>
                    Tất cả danh mục
                 </Link>
                 <Link href="/campaigns" className="text-gray-900 border-b-2 border-gray-900 pb-1 -mb-[18px]">Dịch vụ</Link>
                 <Link href="/products" className="hover:text-gray-900 transition-colors">Sản phẩm</Link>
                 <Link href="/blog" className="hover:text-gray-900 transition-colors">Bài viết</Link>
              </div>

              {/* Right: Auth & Search (simulated) */}
              <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-600">
                 <Link href="/auth/login" className="hover:text-gray-900">Đăng nhập</Link>
                 <Link href="/auth/register" className="hover:text-gray-900">Đăng ký</Link>
                 <button className="hover:text-gray-900">
                    <Search className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Dịch vụ</h1>

          {/* Filters Area */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide w-full lg:w-auto pb-2 lg:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === 'Tất cả' ? '' : cat); setPage(1); }}
                  className={`text-[13px] font-semibold whitespace-nowrap transition-colors relative ${
                    (cat === 'Tất cả' && !category) || category === cat
                      ? 'text-[#3f51b5] after:content-[""] after:absolute after:-bottom-[18px] after:left-0 after:w-full after:h-0.5 after:bg-[#3f51b5]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select
                className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none"
              >
                <option>Media</option>
                {PLATFORMS.filter(p => p !== 'Tất cả').map(p => <option key={p}>{p}</option>)}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none"
              >
                <option value="createdAt">Mới nhất</option>
                <option value="budgetPerReviewer">Giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
              {[...Array(18)].map((_, i) => <div key={i} className="aspect-[3/4] rounded bg-gray-100 animate-pulse" />)}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
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
