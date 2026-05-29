'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, DollarSign, Users, MapPin, Share2, Heart, ExternalLink, Flag, ArrowRight, ShieldCheck, FileCheck, Search } from 'lucide-react';
import Link from 'next/link';
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
      <main className="min-h-screen bg-white pb-20">
        {/* Sub-navbar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
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
              <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-600">
                 <Link href="/auth/login" className="hover:text-gray-900">Đăng nhập</Link>
                 <Link href="/auth/register" className="hover:text-gray-900">Đăng ký</Link>
                 <button className="hover:text-gray-900"><Search className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content (Title, Image, Details) */}
            <div className="lg:col-span-8">
              {/* Breadcrumb / Category */}
              <div className="text-[11px] text-gray-500 mb-2 uppercase font-medium tracking-wide">Toàn quốc</div>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">{campaign.title}</h1>
              
              {/* Image */}
              <div className="w-full aspect-[3/4] md:aspect-[4/5] bg-gray-100 mb-12 relative">
                {campaign.coverUrl ? (
                  <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <span className="text-4xl text-gray-300">🖼️</span>
                  </div>
                )}
              </div>

              {/* Details List */}
              <div className="space-y-12">
                
                {/* Phần thưởng */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                   <div className="font-bold text-gray-900 text-sm">Phần thưởng</div>
                   <div className="md:col-span-3 text-sm text-gray-600 space-y-4">
                     <p className="font-bold text-red-500">{campaign.budgetPerReviewer?.toLocaleString('vi-VN')}đ / Reviewer</p>
                     <div className="whitespace-pre-line leading-relaxed">
                        {campaign.description}
                     </div>
                   </div>
                </div>

                {/* Tiêu chuẩn */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                   <div className="font-bold text-gray-900 text-sm">Tiêu chuẩn reviewer</div>
                   <div className="md:col-span-3 text-sm text-gray-600 space-y-2">
                     <p>Nữ / Nam</p>
                     <p>Khu vực: Toàn quốc</p>
                     <p>Nền tảng: {campaign.platforms?.join(', ')}</p>
                   </div>
                </div>

                {/* Yêu cầu nội dung */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                   <div className="font-bold text-gray-900 text-sm">Yêu cầu nội dung</div>
                   <div className="md:col-span-3 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                     {campaign.contentRequirements || 'Chưa có yêu cầu chi tiết.'}
                   </div>
                </div>
                
                {/* Tham Gia Chiến Dịch */}
                <div className="border-t border-gray-100 pt-12 pb-12">
                   <h2 className="text-xl font-bold text-gray-900 mb-2">Tham Gia Chiến Dịch</h2>
                   <p className="text-xs text-gray-500 mb-8">
                     Vui lòng xác nhận và điền các thông tin bổ sung để đăng ký chiến dịch này.
                   </p>
                   <form className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                         <label className="text-sm font-bold text-gray-900">Thông tin cá nhân *</label>
                         <div className="md:col-span-3">
                            <input type="text" placeholder="Họ và tên" className="w-full text-sm px-4 py-2 border border-gray-200 focus:outline-none" />
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                         <label className="text-sm font-bold text-gray-900">Số điện thoại *</label>
                         <div className="md:col-span-3">
                            <input type="tel" placeholder="+84" className="w-full text-sm px-4 py-2 border border-gray-200 focus:outline-none" />
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                         <label className="text-sm font-bold text-gray-900 pt-2">Điều khoản *</label>
                         <div className="md:col-span-3 bg-gray-50 p-4 border border-gray-100 text-xs text-gray-600 space-y-3 h-48 overflow-y-auto">
                            <p className="font-bold text-blue-600">Vui lòng đọc cẩn thận trước khi bạn nộp đơn.</p>
                            <p>Không thể xóa bỏ bài viết trong thời gian yêu cầu (thường là 30 ngày sau khi chiến dịch kết thúc).</p>
                            <p>Nếu bạn không thực hiện nội dung sau khi nhận sản phẩm, bạn có thể bị phạt.</p>
                            <p>Nội dung hình ảnh có thể được sử dụng làm tư liệu truyền thông bởi nhãn hàng.</p>
                            <label className="flex items-center gap-2 mt-4 font-bold text-gray-900">
                               <input type="checkbox" className="w-4 h-4 accent-black" /> Tôi đồng ý với các điều khoản
                            </label>
                         </div>
                      </div>
                   </form>
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 relative">
               <div className="sticky top-32">
                 <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-sm">
                   <div className="space-y-4 mb-8 text-xs">
                     <div className="flex justify-between items-center text-gray-600">
                       <span>Đăng tuyển</span>
                       <span className="font-semibold text-gray-900">
                         {campaign.deadline ? format(new Date(campaign.deadline), 'dd/MM') : 'Không có'}
                       </span>
                     </div>
                     <div className="flex justify-between items-center text-gray-600">
                       <span>Chọn lọc</span>
                       <span className="font-semibold text-gray-900">Sau khi hết hạn</span>
                     </div>
                     <div className="flex justify-between items-center text-gray-600">
                       <span>Đăng bài</span>
                       <span className="font-semibold text-gray-900">Trong vòng 7 ngày</span>
                     </div>
                   </div>

                   <div className="space-y-4 mb-8 text-gray-600 font-medium">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>Phần thưởng</span>
                        <span className="text-red-500 font-bold">{campaign.budgetPerReviewer?.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>Điều kiện và Điều khoản</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>Hướng dẫn chiến dịch</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>Yêu cầu nội dung</span>
                      </div>
                   </div>

                   <button className="w-full bg-gray-900 text-white font-bold py-3 hover:bg-black transition-colors">
                     Đăng nhập
                   </button>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
