'use client';

import Link from 'next/link';

export default function BrandDashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Main Column */}
      <div className="flex-1 space-y-8">
        
        {/* Top Header Row in Dashboard */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-[15px] font-bold text-gray-900">Hồ sơ nhãn hàng</h2>
          <button className="bg-[#00a65a] text-white text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
            💰 5.000.000 đ
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-lg p-6 bg-white flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-[#3f51b5] mb-2">10</div>
            <div className="text-[11px] text-[#3f51b5] font-bold">Bài viết cần duyệt</div>
            <div className="text-[10px] text-gray-400 mt-1">Nội dung chưa xem</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-6 bg-white flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">14</div>
            <div className="text-[11px] text-gray-900 font-bold">Người xin tham gia</div>
            <div className="text-[10px] text-gray-400 mt-1">Đang chờ bạn duyệt</div>
          </div>
          <div className="border border-gray-100 rounded-lg p-6 bg-white flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">2</div>
            <div className="text-[11px] text-gray-900 font-bold">Chiến dịch đang chờ</div>
            <div className="text-[10px] text-gray-400 mt-1">Chiến dịch mới mở</div>
          </div>
        </div>

        {/* Chart Box */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 mb-1">Tóm tắt tình hình chiến dịch</h3>
              <div className="text-2xl font-bold text-gray-900">5,500,000 đ</div>
            </div>
            <select className="border border-gray-200 rounded px-3 py-1.5 text-[10px] text-gray-600 focus:outline-none">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>
          {/* Simulated Chart */}
          <div className="h-40 w-full bg-gradient-to-t from-blue-50 to-white relative flex items-end px-2 pb-2">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,80 Q10,50 20,70 T40,40 T60,60 T80,20 T100,30 L100,100 L0,100 Z" fill="rgba(63, 81, 181, 0.1)"></path>
              <polyline points="0,80 20,70 40,40 60,60 80,20 100,30" fill="none" stroke="#3f51b5" strokeWidth="2"></polyline>
            </svg>
          </div>
        </div>

        {/* Tasks Box */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white">
          <h3 className="text-[11px] font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Nhiệm vụ cần xử lý</h3>
          <div className="flex gap-6 text-[10px] font-bold border-b border-gray-50 pb-2 mb-4">
            <button className="text-[#3f51b5] border-b-2 border-[#3f51b5] pb-2 -mb-[9px]">Duyệt nội dung (14)</button>
            <button className="text-gray-400 hover:text-gray-600">Chọn reviewer (2)</button>
          </div>

          <div className="space-y-4">
            {/* Task Item 1 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">LN</div>
                <div>
                  <div className="text-[11px] font-bold text-gray-900">Linh Nguyễn</div>
                  <div className="text-[10px] text-gray-500">Đã nộp bài viết - Review Quán ABC</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#3f51b5] text-white text-[10px] font-bold rounded">Duyệt</button>
                <button className="px-3 py-1 border border-gray-200 text-gray-600 text-[10px] font-bold rounded">Từ chối</button>
              </div>
            </div>
            
            {/* Task Item 2 */}
            <div className="flex items-center justify-between py-2 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-xs">HT</div>
                <div>
                  <div className="text-[11px] font-bold text-gray-900">Huy Trần</div>
                  <div className="text-[10px] text-gray-500">Xin tham gia chiến dịch - Mỹ phẩm SOME BY MI</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#3f51b5] text-white text-[10px] font-bold rounded">Chọn</button>
                <button className="px-3 py-1 border border-gray-200 text-gray-600 text-[10px] font-bold rounded">Bỏ qua</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Messages) */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="border border-gray-100 rounded-lg bg-white overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-[11px] font-bold text-gray-900">Trao đổi/Tin nhắn</h3>
          </div>
          <div className="p-4 space-y-4">
            
            {/* Msg 1 */}
            <Link href="/dashboard/brand/messages" className="flex gap-3 hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs shrink-0">HA</div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-bold text-gray-900">Hoàng An</div>
                  <div className="text-[9px] text-gray-400">10:24</div>
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-2">Chào bạn, mình đã cập nhật thêm hình ảnh theo yêu cầu nhé. Bạn check giúp mình ạ!</div>
              </div>
            </Link>

            {/* Msg 2 */}
            <Link href="/dashboard/brand/messages" className="flex gap-3 hover:bg-gray-50 p-2 rounded -mx-2 transition-colors border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs shrink-0">TV</div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-bold text-gray-900">Thanh Vy</div>
                  <div className="text-[9px] text-gray-400">Hôm qua</div>
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-2">Cảm ơn nhãn hàng đã tin tưởng lựa chọn. Mình sẽ gửi bài đúng deadline.</div>
              </div>
            </Link>

            {/* Msg 3 */}
            <Link href="/dashboard/brand/messages" className="flex gap-3 hover:bg-gray-50 p-2 rounded -mx-2 transition-colors border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs shrink-0">LĐ</div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-bold text-gray-900">Lê Dũng</div>
                  <div className="text-[9px] text-gray-400">Hôm qua</div>
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-2">Dạ vâng, mình đã sửa lại caption như gợi ý rồi ạ.</div>
              </div>
            </Link>

          </div>
          <div className="p-4 border-t border-gray-100 text-center">
            <Link href="/dashboard/brand/messages" className="text-[10px] text-[#3f51b5] font-bold hover:underline">
              + Xem thêm tin nhắn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
