'use client';

import { useQuery } from '@tanstack/react-query';
import { Star, CheckCircle, Heart, Instagram, Youtube, Facebook, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data } = await api.get('/reviewers/bookmarks');
      return data.data; // this should return an array of reviewers, or an array of bookmarks with reviewer populated
    },
  });

  const handleRemoveBookmark = async (e: React.MouseEvent, reviewerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/reviewers/${reviewerId}/bookmark`); // toggle off
      toast.success('Đã xóa khỏi danh sách đã lưu');
      refetch();
    } catch (err) {
      toast.error('Lỗi khi xóa bookmark');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 pt-8 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Reviewer đã lưu</h1>
            <p className="text-gray-500 text-sm max-w-2xl">
              Danh sách các Reviewer tiềm năng bạn đã đánh dấu để tiện liên hệ và mời tham gia chiến dịch.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <div key={i} className="h-[280px] bg-white rounded-3xl animate-pulse" />)}
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-lg font-bold text-gray-900">Danh sách trống</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Bạn chưa lưu Reviewer nào.</p>
              <Link href="/reviewers" className="text-sm font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors">
                Khám phá Reviewer ngay
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {data?.map((item: any) => {
                const reviewer = item.reviewer || item; // Depends on API structure (either bookmark.reviewer or reviewer object directly)
                return (
                  <div key={reviewer.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <button 
                      onClick={(e) => handleRemoveBookmark(e, reviewer.id)}
                      className="absolute top-4 right-4 p-2 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-500 transition-colors z-10"
                      title="Bỏ lưu"
                    >
                      <Trash2 className="w-5 h-5" />
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
                        <div className="font-bold text-gray-900 text-sm">{reviewer.engagementRate || 0}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Theo dõi</div>
                        <div className="font-bold text-gray-900 text-sm">
                          {Math.max(reviewer.followersIg || 0, reviewer.followersTiktok || 0).toLocaleString('vi-VN')}
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
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Link 
                        href={`/reviewers/${reviewer.id}`}
                        className="flex-1 text-center py-2 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
