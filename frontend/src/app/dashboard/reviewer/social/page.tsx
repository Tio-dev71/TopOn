'use client';

import Image from 'next/image';

const CATEGORIES = [
  { id: 'nhahang', icon: '🍽️', label: 'Nhà Hàng' },
  { id: 'lamdep', icon: '✂️', label: 'Làm Đẹp' },
  { id: 'mypham', icon: '💄', label: 'Mỹ Phẩm' },
  { id: 'dulich', icon: '✈️', label: 'Du Lịch' },
  { id: 'doisong', icon: '☕', label: 'Đời Sống' },
  { id: 'bachhoa', icon: '🛒', label: 'Bách Hóa' },
  { id: 'congnghe', icon: '💻', label: 'Công Nghệ' },
  { id: 'thoitrang', icon: '👗', label: 'Thời Trang' },
  { id: 'sach', icon: '📚', label: 'Sách' },
  { id: 'thucung', icon: '🐶', label: 'Thú Cưng' },
  { id: 'giaduc', icon: '🎓', label: 'Giáo Dục' },
  { id: 'it', icon: '🖥️', label: 'IT' },
  { id: 'doisong_khac', icon: '🏡', label: 'Đời sống' },
  { id: 'giaitri', icon: '🎮', label: 'Giải Trí' },
  { id: 'thethao', icon: '⚽', label: 'Thể Thao' },
  { id: 'game', icon: '🕹️', label: 'Game' },
  { id: 'kinhdoanh', icon: '💼', label: 'Kinh Doanh' },
  { id: 'thunoi', icon: '🧸', label: 'Thú Nhồi' },
  { id: 'khac', icon: '✨', label: 'Khác' },
];

export default function SocialPage() {
  const renderCategoryMatrix = (platform: string) => (
    <div className="mt-4">
      <div className="grid grid-cols-5 md:grid-cols-9 gap-y-6 gap-x-2 text-center text-gray-500 text-[9px] mb-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="cursor-pointer group">
            <div className={`w-8 h-8 mx-auto border rounded flex items-center justify-center mb-1 text-sm transition-colors ${platform === 'Instagram' && cat.id === 'nhahang' ? 'border-[#3f51b5] bg-blue-50 text-[#3f51b5]' : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'}`}>
              {cat.icon}
            </div>
            <div>{cat.label}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button className="px-10 py-2 bg-[#d1d5db] text-white font-bold text-xs rounded hover:bg-gray-400 transition-colors">
          Lưu hạng mục
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="text-[15px] font-bold text-gray-900 border-b border-gray-900 pb-2 mb-8">
        Mạng xã hội
      </h2>

      <div className="space-y-12">
        {/* Blog */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">Blog <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1 flex gap-2">
            <input type="text" placeholder="Đăng ký từ để ứng tuyển chiến dịch" className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none text-[11px]" />
            <button className="px-6 py-2 border border-gray-200 text-[11px] font-semibold text-gray-600 rounded bg-white hover:bg-gray-50">Thêm Blog</button>
          </div>
        </div>

        {/* Facebook */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">Facebook <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Sao chép và dán URL profile" className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none text-[11px]" />
              <button className="px-6 py-2 border border-gray-200 text-[11px] font-semibold text-gray-600 rounded bg-white hover:bg-gray-50">Kết nối</button>
            </div>
            <p className="text-[9px] text-[#3f51b5] font-semibold">Lưu ý: Link API Fanpage facebook nhạy cảm nếu có Google Analytics với link kết nối trang.</p>
          </div>
        </div>

        {/* Instagram */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">Instagram <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1">
            <input type="text" value="https://www.instagram.com/hoan_1130" readOnly className="w-full px-3 py-2 border border-gray-200 focus:outline-none text-[11px] bg-gray-50 text-gray-600 mb-4" />
            <div className="flex items-center gap-2 border border-[#3f51b5] rounded-full px-3 py-1.5 w-fit text-[11px] text-[#3f51b5] font-semibold mb-6 bg-blue-50/50">
              <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[8px] text-black">👤</span>
              hoan_1130
              <span className="ml-2 text-[10px]">✔️</span>
            </div>
            <label className="text-[10px] text-gray-400 font-semibold mb-2 block">Hạng mục</label>
            {renderCategoryMatrix('Instagram')}
          </div>
        </div>

        {/* Tiktok */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">Tiktok <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1">
            <input type="text" value="ID:Khach1130" readOnly className="w-full px-3 py-2 border border-gray-200 focus:outline-none text-[11px] bg-gray-50 text-gray-600 mb-4" />
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 w-fit text-[11px] text-gray-600 font-semibold mb-6">
              <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[8px] text-black">👤</span>
              1234456abc
              <span className="ml-2 text-[10px]">❌</span>
            </div>
            <label className="text-[10px] text-gray-400 font-semibold mb-2 block">Hạng mục</label>
            {renderCategoryMatrix('Tiktok')}
          </div>
        </div>

        {/* YouTube */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">YouTube <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 w-fit text-[11px] text-gray-600 font-semibold mb-6">
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">T</span>
              Tuân Hoàng
              <span className="ml-2 text-[10px]">❌</span>
            </div>
            <label className="text-[10px] text-gray-400 font-semibold mb-2 block">Hạng mục</label>
            {renderCategoryMatrix('YouTube')}
          </div>
        </div>

        {/* Google Review */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-10">
          <label className="md:w-32 font-bold text-gray-900 text-[11px] shrink-0 pt-2">Google Review <span className="text-gray-400 font-normal">①</span></label>
          <div className="flex-1">
            <button className="px-6 py-2 border border-gray-200 text-[11px] font-semibold text-gray-600 rounded bg-white hover:bg-gray-50 flex items-center gap-2">
              📍 Kết nối Google Review
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-orange-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-500 rounded shadow-sm flex-shrink-0"></div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 mb-1">
                Chuyên trang chế độ <span className="text-orange-500">Available Reviewer</span> ngay bây giờ<br/>để tham gia vô số chiến dịch hấp dẫn!
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold text-gray-900 mb-1">Đăng ký trở thành sách reviewer</div>
            <div className="text-[9px] text-gray-500 mb-2">Bạn có thể chuyển sang chế độ Available Reviewer sau khi đăng ký, hãy cập nhật thông tin bổ sung.</div>
            <button className="px-6 py-2 bg-[#d1d5db] text-white font-bold text-[10px] rounded hover:bg-gray-400 transition-colors">
              Đăng ký trở thành sách reviewer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
