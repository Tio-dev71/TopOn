'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Về nền tảng',
    items: [
      { q: 'TopOn là gì?', a: 'TopOn là nền tảng kết nối các Reviewer và Nhà quảng cáo.' },
      { q: 'Mốc reviewer là gì?', a: 'Mốc reviewer là cấp độ đánh giá dựa trên mức độ hoạt động và ảnh hưởng của bạn.' },
      { q: 'Chiến dịch Performance là gì?', a: 'Là chiến dịch mà thù lao của bạn được tính dựa trên hiệu quả thực tế mang lại (lượt click, đơn hàng).' },
      { q: 'Làm thế nào để tham gia Chiến dịch Review?', a: 'Bạn cần đăng ký tài khoản, kết nối mạng xã hội và nhấn Ứng tuyển vào chiến dịch phù hợp.' },
      { q: 'Tài khoản MXH của tôi phải đáp ứng điều kiện gì?', a: 'Bạn cần có lượng followers nhất định và tương tác tốt trên các nền tảng.' },
      { q: 'Làm sao để được tuyển chọn?', a: 'Hãy điền đầy đủ thông tin profile và luôn hoàn thành tốt các chiến dịch trước đó.' },
      { q: 'Làm sao để rút thù lao?', a: 'Bạn có thể rút thù lao vào tài khoản ngân hàng đã đăng ký ở phần Thông tin bổ sung.' },
    ]
  },
  {
    category: 'Quản lý tài khoản của bạn',
    items: [
      { q: 'Thông tin của tôi có an toàn không?', a: 'Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của bạn theo chính sách bảo mật.' },
      { q: 'Làm sao để cập nhật hoặc thay đổi thông tin hồ sơ cá nhân?', a: 'Bạn vào mục Tài khoản > Thông tin để cập nhật.' },
    ]
  },
  {
    category: 'Giao hàng và Đặt chỗ',
    items: [
      { q: 'Tôi đã được nhận làm reviewer. Tôi cần đến shop/nhà hàng như thế nào?', a: 'Bạn xem hướng dẫn cụ thể trong chi tiết chiến dịch và đặt lịch hẹn trước nếu được yêu cầu.' },
      { q: 'Sau bao lâu thì tôi nhận được sản phẩm?', a: 'Thường từ 3-5 ngày làm việc kể từ khi bạn được thông báo chọn.' },
      { q: 'Tôi cần nhận/nhận được hàng?', a: 'Nếu có vấn đề về vận chuyển, hãy liên hệ ngay với nhà quảng cáo qua phần trao đổi.' },
    ]
  }
];

export default function ReviewerFAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-[15px] font-bold text-gray-900 border-b border-gray-900 pb-2 mb-8">
        Những câu hỏi thường gặp
      </h2>

      <div className="space-y-10">
        {FAQ_DATA.map((group, cIdx) => (
          <div key={group.category}>
            <h3 className="text-sm font-bold text-gray-900 mb-4">{group.category}</h3>
            <div className="space-y-1">
              {group.items.map((item, iIdx) => {
                const key = `${cIdx}-${iIdx}`;
                const isOpen = openItems[key];
                return (
                  <div key={iIdx} className="border-b border-gray-100">
                    <button 
                      onClick={() => toggleItem(cIdx, iIdx)}
                      className="w-full flex items-center gap-2 py-3 text-left hover:bg-gray-50 transition-colors px-2"
                    >
                      <span className="text-gray-400 font-bold">-</span>
                      <span className="text-[11px] text-gray-600 flex-1">{item.q}</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 py-3 text-[11px] text-gray-500 bg-gray-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
