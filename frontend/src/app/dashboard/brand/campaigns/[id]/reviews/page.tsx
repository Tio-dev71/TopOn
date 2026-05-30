'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Check, X, Eye } from 'lucide-react';

const DUMMY_REVIEWS = [
  {
    id: 1,
    author: 'Huy Trần',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    time: '2 giờ trước',
    content: 'Đồ uống rất ngon, không gian chill. Mình đã chụp rất nhiều ảnh đẹp và check-in trên Facebook. Cảm ơn quán!',
    link: 'https://facebook.com/post/123456789',
    images: [],
    status: 'pending'
  },
  {
    id: 2,
    author: 'Linh Nguyễn',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    time: '5 giờ trước',
    content: 'Trải nghiệm tuyệt vời. Mình có quay 1 clip ngắn trên Tiktok nhé.',
    link: 'https://tiktok.com/@linh/video/987654321',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1495474472205-51f750c0b007?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop'
    ],
    status: 'pending'
  },
  {
    id: 3,
    author: 'Anh Khang',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    time: '1 ngày trước',
    content: 'Review chi tiết trên Blog cá nhân của mình.',
    link: 'https://blog.com/review-quan-abc',
    images: [],
    status: 'approved'
  }
];

export default function BrandReviewApprovalPage() {
  const [activeTab, setActiveTab] = useState('Tất cả (3)');

  const TABS = ['Tất cả (3)', 'Chưa duyệt (2)', 'Đã duyệt (1)', 'Đã từ chối (0)'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
          <Link href="/dashboard/brand/campaigns" className="hover:text-gray-900">Quản lý chiến dịch</Link>
          <span>&gt;</span>
          <Link href="/dashboard/brand/campaigns/1" className="hover:text-gray-900">Review Quán ABC</Link>
          <span>&gt;</span>
          <span className="text-gray-900">Duyệt nội dung review</span>
        </div>
      </div>

      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-6 text-[11px] font-bold overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${activeTab === tab ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
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

        {/* Reviews List */}
        <div className="space-y-6">
          {DUMMY_REVIEWS.map((review) => (
            <div key={review.id} className="border border-gray-100 rounded-lg p-5 bg-white flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative bg-gray-100 border border-gray-200">
                <Image src={review.avatar} alt={review.author} fill className="object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 flex items-center gap-1">
                      {review.author} <span className="w-3 h-3 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-[8px]">✓</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Đã nộp bài review • {review.time}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 bg-[#2563eb] text-white font-bold text-[10px] rounded flex items-center gap-1 hover:bg-blue-700 transition-colors">
                      <Check className="w-3 h-3" /> Duyệt
                    </button>
                    <button className="px-4 py-1.5 border border-gray-200 text-gray-600 font-bold text-[10px] rounded flex items-center gap-1 hover:bg-gray-50 transition-colors">
                      <X className="w-3 h-3" /> Từ chối
                    </button>
                    <button className="px-2 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors">
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-gray-700 mb-3 whitespace-pre-line leading-relaxed">
                  {review.content}
                </div>
                
                <a href={review.link} target="_blank" rel="noreferrer" className="text-[10px] text-[#3f51b5] hover:underline mb-3 inline-block font-bold">
                  🔗 {review.link}
                </a>

                {review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded bg-gray-100 relative overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90">
                         <Image src={img} alt="Review attachment" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
