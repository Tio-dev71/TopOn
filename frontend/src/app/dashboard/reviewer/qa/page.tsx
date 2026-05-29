'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QAPage() {
  const [view, setView] = useState<'list' | 'create'>('list');

  const DUMMY_DATA = [
    { id: 1, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum?', date: '23/01/24', status: '-' }
  ];

  if (view === 'create') {
    return (
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-2 mb-8">
          <h2 className="text-[15px] font-bold text-gray-900">
            Q & A
          </h2>
          <span className="text-[11px] text-gray-400 font-bold">Hỏi đáp 1:1</span>
        </div>

        <div className="border border-gray-200 rounded p-6 space-y-6">
          <div className="flex items-center gap-4">
            <label className="text-[11px] font-bold text-gray-900 w-24">Phân loại <span className="text-red-500">*</span></label>
            <select className="flex-1 px-3 py-2 text-[11px] border border-gray-200 focus:outline-none bg-white">
              <option>Chọn phân loại</option>
              <option>Chiến dịch</option>
              <option>Tài khoản</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="flex items-start gap-4">
            <label className="text-[11px] font-bold text-gray-900 w-24 pt-2">Nội dung hỏi đáp <span className="text-red-500">*</span></label>
            <textarea 
              rows={8}
              className="flex-1 px-3 py-2 text-[11px] border border-gray-200 focus:outline-none resize-none"
              placeholder="Nhập nội dung câu hỏi của bạn..."
            />
          </div>
          
          <div className="flex justify-center gap-2 pt-4 border-t border-gray-100">
            <button 
              onClick={() => setView('list')}
              className="px-8 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={() => setView('list')}
              className="px-8 py-2 bg-gray-900 text-white font-bold text-[11px] rounded hover:bg-black transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-6">
        <h2 className="text-[15px] font-bold text-gray-900">
          Q & A
        </h2>
        <button 
          onClick={() => setView('create')}
          className="px-6 py-1.5 bg-gray-900 text-white font-bold text-[10px] rounded hover:bg-black transition-colors"
        >
          Viết
        </button>
      </div>

      <div className="w-full">
        {/* Table Header */}
        <div className="flex text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-2 mb-2 text-center px-4">
          <div className="w-12 text-left">No</div>
          <div className="flex-1 text-left">Tiêu đề</div>
          <div className="w-24">Ngày</div>
          <div className="w-24">Trạng thái</div>
        </div>

        {/* Table Body */}
        {DUMMY_DATA.map((item) => (
          <div key={item.id} className="flex items-center text-[11px] text-gray-600 border-b border-gray-50 py-3 text-center px-4 hover:bg-gray-50 cursor-pointer">
            <div className="w-12 text-left text-gray-400">{item.id}</div>
            <div className="flex-1 text-left truncate pr-4">{item.title}</div>
            <div className="w-24 text-gray-400">{item.date}</div>
            <div className="w-24">{item.status}</div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="text-gray-300 hover:text-gray-600 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-[11px] font-bold text-[#3f51b5]">1</span>
          <button className="text-gray-300 hover:text-gray-600 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
