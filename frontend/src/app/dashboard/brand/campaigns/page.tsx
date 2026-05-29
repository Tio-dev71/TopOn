'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const DUMMY_CAMPAIGNS = [
  { id: 1, title: 'Review Cửa hàng XYZ', category: 'F&B', platforms: ['Tiktok'], registered: 14, max: 20, status: 'Đang chạy', deadline: '20/01/2024', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop' },
  { id: 2, title: 'Mỹ phẩm SOME BY MI', category: 'Làm Đẹp', platforms: ['Tiktok', 'Instagram'], registered: 50, max: 50, status: 'Chờ duyệt', deadline: '23/01/2024', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
  { id: 3, title: 'Review Quán ABC', category: 'F&B', platforms: ['Facebook'], registered: 5, max: 10, status: 'Hoàn thành', deadline: '15/01/2024', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop' },
];

export default function BrandCampaignsPage() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const TABS = [
    { label: 'Tất cả', count: 3 },
    { label: 'Đang chạy', count: 1 },
    { label: 'Chờ duyệt', count: 1 },
    { label: 'Chờ chọn', count: 0 },
    { label: 'Hoàn thành', count: 1 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <h2 className="text-[15px] font-bold text-gray-900">
          Quản lý chiến dịch
        </h2>
        <Link 
          href="/campaigns/create"
          className="px-6 py-1.5 bg-[#00a65a] text-white font-bold text-[10px] rounded flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          + Tạo chiến dịch mới
        </Link>
      </div>

      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 mb-6 text-[11px] font-bold overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-2 ${activeTab === tab.label ? 'text-[#3f51b5] border-b-2 border-[#3f51b5]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label} <span className="text-gray-300 ml-1">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="flex text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-2 mb-4 text-center px-4">
          <div className="flex-1 text-left">Chiến dịch</div>
          <div className="w-24">Đăng ký</div>
          <div className="w-32">Trạng thái</div>
          <div className="w-24">Thời hạn</div>
          <div className="w-12"></div>
        </div>

        {/* Table Body */}
        <div className="space-y-4">
          {DUMMY_CAMPAIGNS.filter(c => activeTab === 'Tất cả' || c.status === activeTab).map((campaign) => (
            <div key={campaign.id} className="flex items-center border border-gray-100 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
              {/* Campaign Info */}
              <div className="flex-1 flex gap-4">
                <div className="w-16 h-16 rounded bg-gray-100 shrink-0 relative overflow-hidden">
                  <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
                </div>
                <div>
                  <Link href={`/dashboard/brand/campaigns/${campaign.id}`} className="text-[11px] font-bold text-gray-900 hover:text-[#3f51b5] mb-1 line-clamp-1">
                    {campaign.title}
                  </Link>
                  <div className="text-[9px] text-gray-500 mb-2 flex items-center gap-1">
                    <span>{campaign.category}</span>
                  </div>
                  <div className="flex gap-1">
                    {campaign.platforms.map(p => (
                      <span key={p} className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Registered */}
              <div className="w-24 text-center text-[10px] font-bold text-gray-600">
                <span className="text-[#3f51b5]">{campaign.registered}</span> / {campaign.max}
              </div>

              {/* Status */}
              <div className="w-32 text-center flex justify-center">
                <select className="border border-gray-200 text-[10px] font-bold text-gray-600 rounded px-2 py-1 bg-white focus:outline-none">
                  <option selected>{campaign.status}</option>
                  <option>Dừng chiến dịch</option>
                  <option>Xóa</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="w-24 text-center text-[10px] text-gray-500">
                {campaign.deadline}
              </div>

              {/* Actions */}
              <div className="w-12 flex justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="text-gray-300 hover:text-gray-600 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-[11px] font-bold text-[#3f51b5] px-2 py-1 bg-blue-50 rounded">1</span>
          <button className="text-gray-300 hover:text-gray-600 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
