'use client';

import Link from 'next/link';

const categories = [
  { icon: 'REVU\nGUIDE', bg: 'bg-[#f0ece1]', label: 'Hướng dẫn Dịch vụ', href: '/campaigns?category=Hướng dẫn' },
  { icon: '🍽️', bg: 'bg-[#fdf3d1]', label: 'Nhà hàng, cafe', href: '/campaigns?category=Nhà hàng' },
  { icon: '💄', bg: 'bg-[#ffe4e1]', label: 'Làm đẹp', href: '/campaigns?category=Làm đẹp' },
  { icon: '✈️', bg: 'bg-[#e6e6fa]', label: 'Du lịch', href: '/campaigns?category=Du lịch' },
  { icon: '🎮', bg: 'bg-[#ffe4e1]', label: 'Giải trí', href: '/campaigns?category=Giải trí' },
  { icon: '🍜', bg: 'bg-[#f5f5dc]', label: 'Đồ ăn, thức uống', href: '/campaigns?category=Ẩm uống' },
  { icon: '🛋️', bg: 'bg-[#e0ffff]', label: 'Lối sống', href: '/campaigns?category=Lifestyle' },
  { icon: '💻', bg: 'bg-[#e6ffe6]', label: 'Công nghệ', href: '/campaigns?category=Công nghệ' },
  { icon: '💼', bg: 'bg-[#e6f2ff]', label: 'Tuyển dụng', href: '/campaigns?category=Tuyển dụng' },
  { icon: '🏠', bg: 'bg-[#ffe4b5]', label: 'Nhà quảng cáo', href: '/auth/register-advertiser' },
];

export default function CategoryBar() {
  return (
    <section className="bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-2 justify-start md:justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-2 min-w-[72px] group"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${cat.bg} flex items-center justify-center text-xl md:text-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1`}>
                {cat.icon.length > 2 ? <span className="text-[8px] font-bold text-center leading-tight text-gray-500" dangerouslySetInnerHTML={{__html: cat.icon.replace('\n', '<br/>')}}></span> : cat.icon}
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium text-center leading-tight hover:text-gray-900 transition-colors whitespace-nowrap">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
