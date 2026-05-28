'use client';

import Link from 'next/link';

const categories = [
  { icon: '📚', label: 'Hướng dẫn dịch vụ', href: '/campaigns?category=Hướng dẫn' },
  { icon: '🍽️', label: 'Nhà hàng / Cafe', href: '/campaigns?category=Nhà hàng' },
  { icon: '💄', label: 'Làm đẹp', href: '/campaigns?category=Làm đẹp' },
  { icon: '✈️', label: 'Du lịch', href: '/campaigns?category=Du lịch' },
  { icon: '🎮', label: 'Giải trí', href: '/campaigns?category=Giải trí' },
  { icon: '🍜', label: 'Ẩm uống', href: '/campaigns?category=Ẩm uống' },
  { icon: '👗', label: 'Lifestyle', href: '/campaigns?category=Lifestyle' },
  { icon: '💻', label: 'Công nghệ', href: '/campaigns?category=Công nghệ' },
  { icon: '💼', label: 'Tuyển dụng', href: '/campaigns?category=Tuyển dụng' },
  { icon: '👶', label: 'Mẹ & bé', href: '/campaigns?category=Mẹ bé' },
];

export default function CategoryBar() {
  return (
    <section className="bg-white border-y border-gray-100 py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-2 min-w-[72px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-50 group-hover:border-blue-100 transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5">
                {cat.icon}
              </div>
              <span className="text-xs text-gray-600 font-medium text-center leading-tight group-hover:text-blue-600 transition-colors whitespace-nowrap">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
