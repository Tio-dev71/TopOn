'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Eye, MousePointerClick, Calendar, Gift, Users } from 'lucide-react';

export default function BrandCampaignDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [activeTab, setActiveTab] = useState('Thống kê');

  const TABS = ['Thống kê', 'Người ứng tuyển', 'Reviewer đã chọn', 'Review đã đăng'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
          <Link href="/dashboard/brand/campaigns" className="hover:text-gray-900">Quản lý chiến dịch</Link>
          <span>&gt;</span>
          <span className="text-gray-900">Review Quán ABC</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-6 py-1.5 bg-[#2563eb] text-white font-bold text-[10px] rounded hover:bg-blue-700 transition-colors">
            + Chỉnh sửa
          </button>
          <button className="px-4 py-1.5 border border-gray-200 text-gray-600 font-bold text-[10px] rounded hover:bg-gray-50 transition-colors">
            Dừng chiến dịch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-8 text-[11px] font-bold overflow-x-auto whitespace-nowrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? 'text-[#3f51b5] border-b-2 border-[#3f51b5]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Thống kê' && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Campaign Card */}
          <div className="w-full lg:w-80 border border-gray-100 rounded-lg bg-white overflow-hidden shrink-0">
            <div className="relative aspect-video bg-gray-100 w-full">
              <Image src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" alt="Cover" fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-[13px] font-bold text-gray-900 mb-2">Review Quán ABC</h3>
              <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-4">
                 <span className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-[8px]">🏢</span>
                 ABC Coffee
              </div>
              <div className="text-[10px] text-gray-500 bg-gray-50 px-3 py-2 rounded">
                 <strong>Deadline:</strong> 30/01/2024
              </div>
            </div>
          </div>

          {/* Right: Stats & Details */}
          <div className="flex-1 space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
                  <Eye className="w-4 h-4 text-[#3f51b5]" /> Thống kê
                </div>
                <div className="space-y-2 text-[10px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Lượt xem trang:</span>
                    <span className="font-bold text-gray-900">890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lượt click link:</span>
                    <span className="font-bold text-gray-900">45</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
                  <Calendar className="w-4 h-4 text-orange-500" /> Tiến độ chiến dịch
                </div>
                <div className="space-y-2 text-[10px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Hoàn thành:</span>
                    <span className="font-bold text-gray-900">3 ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hạn đăng bài:</span>
                    <span className="font-bold text-gray-900">30/01/2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
                <Gift className="w-4 h-4 text-green-500" /> Quyền lợi
              </div>
              <div className="space-y-2 text-[10px] text-gray-600">
                <div className="flex justify-between">
                  <span>Thù lao:</span>
                  <span className="font-bold text-red-500">900.000đ</span>
                </div>
                <div className="flex justify-between border-t border-gray-50 pt-2 mt-2">
                  <span>Combo trải nghiệm trị giá 1 triệu tại Quán ABC</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
                <Users className="w-4 h-4 text-purple-500" /> Tiêu chí ứng viên
              </div>
              <div className="space-y-2 text-[10px] text-gray-600">
                <div className="flex justify-between">
                  <span>Nền tảng:</span>
                  <span className="font-bold text-gray-900">Tiktok, Instagram</span>
                </div>
                <div className="flex justify-between">
                  <span>Yêu cầu Followers:</span>
                  <span className="font-bold text-gray-900">10k+</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href={`/dashboard/brand/campaigns/${id}/reviews`} className="px-6 py-2 bg-[#d1d5db] text-white font-bold text-[10px] rounded hover:bg-gray-400 transition-colors">
                Xem duyệt nội dung &gt;
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'Thống kê' && (
        <div className="py-20 text-center text-gray-400 text-[11px]">
          Dữ liệu cho tab "{activeTab}" đang được cập nhật.
        </div>
      )}
    </div>
  );
}
