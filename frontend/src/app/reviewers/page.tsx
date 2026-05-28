'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Star, CheckCircle, Instagram, Youtube, Facebook, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tất cả', 'Làm đẹp', 'Du lịch', 'Ẩm thực', 'Lifestyle', 'Công nghệ', 'Thời trang', 'Nhà bếp', 'Giải trí'];
const PLATFORMS = ['Tất cả', 'TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'];
const SORTS = [
  { value: 'followersDesc', label: 'Nhiều follower nhất' },
  { value: 'ratingDesc', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới tham gia' },
];

export default function ReviewersSearchPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState('');
  const [sortBy, setSortBy] = useState('followersDesc');
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reviewers', 'search', { search, category, platform, sortBy, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        ...(search && { search }),
        ...(category && category !== 'Tất cả' && { category }),
        ...(platform && platform !== 'Tất cả' && { platform }),
        sortBy
      });
      const { data } = await api.get(`/reviewers?${params}`);
      return data;
    },
  });

  const getPlatformIcon = (p: string) => {
    switch (p) {
      case 'TIKTOK': return '🎵';
      case 'INSTAGRAM': return <Instagram className="w-3.5 h-3.5" />;
      case 'YOUTUBE': return <Youtube className="w-3.5 h-3.5" />;
      case 'FACEBOOK': return <Facebook className="w-3.5 h-3.5" />;
      default: return p;
    }
  };

  const getPlatformColor = (p: string) => {
    switch (p) {
      case 'TIKTOK': return 'bg-black text-white';
      case 'INSTAGRAM': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'YOUTUBE': return 'bg-blue-600 text-white';
      case 'FACEBOOK': return 'bg-blue-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const handleBookmark = async (e: React.MouseEvent, reviewerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'ADVERTISER') {
      toast.error('Chỉ Advertiser mới có thể lưu Reviewer!');
      return;
    }
    try {
      await api.post(`/reviewers/${reviewerId}/bookmark`);
      toast.success('Đã cập nhật danh sách lưu');
      // If we want to instantly reflect UI, we might need a refetch or optimistic update.
      refetch();
    } catch (err) {
      toast.error('Lỗi khi lưu Reviewer');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 pt-8 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Tìm kiếm Reviewer</h1>
            <p className="text-gray-500 text-sm max-w-2xl">
              Khám phá hàng ngàn content creator, KOC, KOL phù hợp với lĩnh vực kinh doanh của bạn. Đánh giá chất lượng dựa trên chỉ số tương tác và review thực tế.
            </p>

            {/* Search & Sort */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, kỹ năng, lĩnh vực..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
              </div>
              <div className="relative min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="w-full appearance-none pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer shadow-sm"
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filters Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Nền tảng
                </h3>
                <div className="flex flex-col gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      onClick={() => { setPlatform(p === 'Tất cả' ? '' : p); setPage(1); }}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        (p === 'Tất cả' && !platform) || platform === p
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p === 'Tất cả' ? 'Tất cả nền tảng' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Lĩnh vực</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat === 'Tất cả' ? '' : cat); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        (cat === 'Tất cả' && !category) || category === cat
                          ? 'bg-gray-900 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-500 font-medium">
                Tìm thấy <span className="text-gray-900">{data?.meta?.total || 0}</span> reviewer phù hợp
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-[280px] bg-white rounded-3xl animate-pulse" />)}
                </div>
              ) : data?.data?.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-900">Không tìm thấy reviewer nào</h3>
                  <p className="text-gray-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {data?.data?.map((reviewer: any) => (
                      <div key={reviewer.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <button 
                          onClick={(e) => handleBookmark(e, reviewer.id)}
                          className="absolute top-4 right-4 p-2 bg-gray-50/80 hover:bg-blue-50 rounded-full text-gray-400 hover:text-blue-500 transition-colors z-10"
                        >
                          <Heart className={`w-5 h-5 ${reviewer.isBookmarked ? 'fill-red-500 text-blue-500' : ''}`} />
                        </button>

                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden relative flex-shrink-0">
                            {reviewer.user?.profile?.avatarUrl ? (
                              <Image src={reviewer.user.profile.avatarUrl} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl font-black text-gray-400 bg-gray-100">
                                {reviewer.user?.profile?.fullName?.[0] || 'R'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base truncate flex items-center gap-1">
                              {reviewer.user?.profile?.fullName || 'Reviewer'}
                              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            </h3>
                            <div className="text-xs font-semibold text-gray-500 mt-0.5 truncate">
                              {reviewer.igHandle || reviewer.tiktokHandle || 'Content Creator'}
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold text-gray-900">{reviewer.avgRating?.toFixed(1) || '0.0'}</span>
                              <span className="text-xs text-gray-400">({reviewer.totalCampaigns} jobs)</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 rounded-2xl p-3">
                          <div>
                            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Tương tác</div>
                            <div className="font-bold text-gray-900 text-sm">{reviewer.engagementRate}%</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Theo dõi</div>
                            <div className="font-bold text-gray-900 text-sm">
                              {Math.max(reviewer.followersIg, reviewer.followersTiktok).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {reviewer.specialties?.slice(0, 3).map((spec: string) => (
                            <span key={spec} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold">
                              {spec}
                            </span>
                          ))}
                          {reviewer.specialties?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold">
                              +{reviewer.specialties.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          {reviewer.followersTiktok > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded-md text-[10px] font-bold">
                              🎵 {reviewer.followersTiktok > 1000 ? (reviewer.followersTiktok/1000).toFixed(1)+'k' : reviewer.followersTiktok}
                            </div>
                          )}
                          {reviewer.followersIg > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-[10px] font-bold">
                              <Instagram className="w-3 h-3"/> {reviewer.followersIg > 1000 ? (reviewer.followersIg/1000).toFixed(1)+'k' : reviewer.followersIg}
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {data?.meta?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white shadow-sm"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(data?.meta?.totalPages, p + 1))}
                        disabled={page === data?.meta?.totalPages}
                        className="px-4 py-2 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors bg-white shadow-sm"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
