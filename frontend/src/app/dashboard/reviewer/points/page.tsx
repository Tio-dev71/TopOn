'use client';

import { useState } from 'react';

export default function PointsPage() {
  const [activeTab, setActiveTab] = useState('withdraw');

  return (
    <div className="w-full">
      <h2 className="text-[15px] font-bold text-gray-900 border-b border-gray-900 pb-2 mb-8">
        Điểm của tôi
      </h2>

      {/* Points Summary Box */}
      <div className="flex border border-gray-100 rounded-lg mb-8 divide-x divide-gray-100">
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-[11px] text-gray-500 font-bold mb-2">Số điểm hiện tại</div>
          <div className="text-2xl font-bold text-gray-900">0P</div>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-[11px] text-gray-500 font-bold mb-2">Điểm cộng dồn</div>
          <div className="text-lg font-bold text-gray-400">0P</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-8 text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`pb-2 ${activeTab === 'withdraw' ? 'text-[#3f51b5] border-b-2 border-[#3f51b5]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Tín dụng/Rút xu
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 ${activeTab === 'history' ? 'text-[#3f51b5] border-b-2 border-[#3f51b5]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Tích lũy
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 text-gray-300">
        <div className="text-4xl mb-4">💸</div>
        <div className="text-[11px] font-semibold">Không có dữ liệu</div>
      </div>
    </div>
  );
}
