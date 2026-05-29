'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function ReviewerCampaignDetail() {
  const params = useParams();
  const id = params?.id;
  const [reviewLink, setReviewLink] = useState('');

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data } = await api.get(`/campaigns/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const STEPS = ['Đã Ứng Tuyển', 'Đã Được Chọn', 'Đã Thông Báo', 'Đã Hoàn Thành'];
  const currentStep = 1; // "Đã Được Chọn"

  if (isLoading) return <div className="py-20 text-center">Đang tải...</div>;
  if (!campaign) return <div className="py-20 text-center">Không tìm thấy chiến dịch</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <h2 className="text-[15px] font-bold text-gray-900">Chiến dịch của tôi</h2>
        <Link href="/dashboard/reviewer" className="text-xs text-gray-500 hover:text-gray-900">xem thêm &gt;</Link>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Status Tracker */}
        <div>
          <div className="flex items-center text-[11px] font-bold text-gray-400 mb-2 overflow-x-auto whitespace-nowrap">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 ${index <= currentStep ? 'text-[#3f51b5]' : 'text-gray-400'}`}>
                  <span>{step}</span>
                  <span>0</span>
                </div>
                {index < STEPS.length - 1 && <ChevronRight className="w-3 h-3 mx-4 shrink-0 text-gray-300" />}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400">Cám ơn đã ứng tuyển. Quá trình chọn Reviewers đang diễn ra. 🕒</p>
        </div>

        {/* Campaign Card */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white flex flex-col md:flex-row gap-6">
          {/* Info Side */}
          <div className="flex-1 flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden shrink-0 relative">
              {campaign.coverUrl ? (
                <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">{campaign.title}</h3>
              <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                 <span className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-[8px]">🏢</span>
                 {campaign.advertiser?.companyName || 'ABC Coffee'}
              </div>
              <div className="text-[10px] text-gray-500">Deadline: {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('vi-VN') : '20/01/2024'}</div>
            </div>
          </div>

          {/* Details & Actions Side */}
          <div className="flex-1 flex flex-col items-end">
            <div className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-4 flex items-center gap-1">
              🎉 Đã Được Chọn
            </div>
            <div className="w-full">
              <div className="text-[11px] font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">Quyền lợi</div>
              <div className="text-[10px] text-gray-600 mb-4 space-y-1">
                <div>Thù lao: <span className="font-bold text-red-500">{campaign.budgetPerReviewer?.toLocaleString('vi-VN') || '900.000'}đ</span></div>
                <div>🎁 {campaign.description || 'combo trải nghiệm trị giá 1 triệu'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-3 h-3" /> Chia sẻ thông tin chiến dịch
                </button>
                <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-3 h-3" /> Trao đổi với nhà quảng cáo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white">
          <h3 className="text-[11px] font-bold text-gray-900 mb-4">Hướng dẫn chi tiết</h3>
          <div className="text-[11px] text-gray-600 space-y-2 whitespace-pre-line">
            {campaign.contentRequirements || 
`- Viết 1 bài post Facebook (public)
- Ít nhất 3 ảnh trải nghiệm tại Quán ABC
- Gắn hashtag #ABC, #Revu`}
          </div>
        </div>

        {/* Link Submission */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white">
          <h3 className="text-[11px] font-bold text-gray-900 mb-4">Link bài review</h3>
          <input 
            type="url" 
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
            placeholder="Dán đường link bài review của bạn tại đây"
            className="w-full px-4 py-2 border border-gray-200 focus:outline-none text-[11px] rounded mb-4"
          />
          <button className="px-8 py-2 bg-[#d1d5db] text-white font-bold text-[10px] rounded hover:bg-gray-400 transition-colors">
            Gửi bài review
          </button>
          <div className="mt-4 border-t border-gray-50 pt-4 text-[10px] text-[#3f51b5] hover:underline cursor-pointer">
            &gt; Xem hướng dẫn gửi bài review
          </div>
        </div>
      </div>
    </div>
  );
}
