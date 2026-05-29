'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function ReviewerDashboard() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['reviewer-campaigns-applied'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns/my/applied?limit=5');
      return data.data;
    },
  });

  return (
    <div className="space-y-12">
      {/* Chiến dịch của tôi */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">Chiến dịch của tôi</h2>
          <Link href="/dashboard/reviewer/campaigns" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
            xem thêm <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center text-[11px] font-semibold text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-4 text-[#3f51b5]">
            <span>Đã Ứng Tuyển</span>
            <span className="text-[#3f51b5] font-bold">0</span>
          </div>
          <ChevronRight className="w-3 h-3 mx-4 shrink-0" />
          <div className="flex items-center gap-4">
            <span>Đã Được Chọn</span>
            <span>0</span>
          </div>
          <ChevronRight className="w-3 h-3 mx-4 shrink-0" />
          <div className="flex items-center gap-4">
            <span>Đã Thông Báo</span>
            <span>0</span>
          </div>
          <ChevronRight className="w-3 h-3 mx-4 shrink-0" />
          <div className="flex items-center gap-4">
            <span>Đã Hoàn Thành</span>
            <span>0</span>
          </div>
        </div>

        <div className="text-[10px] text-gray-400 mb-12 flex items-center gap-1">
          Cảm ơn đã ứng tuyển, quá trình chọn Reviewers đang diễn ra. 🕒
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center mb-4 text-gray-300">
            <span className="text-2xl">😐</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 text-center">Bạn chưa ứng tuyển chiến dịch nào.<br/>Ứng tuyển nhiều chiến dịch</p>
          <Link href="/campaigns" className="px-6 py-2 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded hover:bg-gray-50 transition-colors">
            Xem mọi chiến dịch
          </Link>
        </div>
      </div>

      {/* Chiến dịch yêu thích */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-8">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">Chiến dịch yêu thích <span className="text-[#3f51b5]">0</span></h2>
          <Link href="#" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
            xem thêm <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center mb-4">
            <span className="text-red-300 text-2xl">❤️</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 text-center">Bạn chưa thêm bất kỳ chiến dịch nào vào<br/>danh sách yêu thích.</p>
          <Link href="/campaigns" className="px-6 py-2 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded hover:bg-gray-50 transition-colors">
            Khám phá chiến dịch
          </Link>
        </div>
      </div>

      {/* Review của tôi */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-8">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">Review của tôi <span className="text-[#3f51b5]">0</span></h2>
          <Link href="#" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
            xem thêm <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center mb-4 text-gray-300">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 text-center">Bạn chưa thực hiện đánh giá nào vào<br/>danh sách yêu thích.</p>
          <Link href="/campaigns" className="px-6 py-2 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded hover:bg-gray-50 transition-colors">
            Xem mọi chiến dịch
          </Link>
        </div>
      </div>
    </div>
  );
}
