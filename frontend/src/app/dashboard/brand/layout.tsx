'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/auth.store';

export default function BrandDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const sidebarNav = [
    {
      title: 'Hoạt động chiến dịch',
      items: [
        { label: 'Dashboard', href: '/dashboard/brand' },
        { label: 'Quản lý chiến dịch', href: '/dashboard/brand/campaigns', count: 0 },
        { label: 'Tạo chiến dịch', href: '/dashboard/brand/campaigns/create' },
        { label: 'Quản lý reviewer', href: '#' },
        { label: 'Thống kê', href: '#' },
        { label: 'Báo cáo', href: '#' },
      ]
    },
    {
      title: 'Dịch vụ khách hàng',
      items: [
        { label: 'Q&A', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Hướng dẫn Dịch vụ', href: '#' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Green Header Banner */}
      <div className="h-48 bg-[#00a65a] w-full mt-0"></div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 -mt-24 mb-20 relative z-10">
        {/* Brand Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex items-center gap-6 flex-1">
            <div className="w-20 h-20 rounded-full bg-blue-50 border border-gray-100 flex items-center justify-center text-blue-300 text-3xl shrink-0 overflow-hidden">
               {user?.profile?.avatarUrl ? (
                 <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 '🏢'
               )}
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Chào!</div>
              <div className="text-xl font-bold text-gray-900">{user?.profile?.companyName || 'Nhãn hàng A'}</div>
            </div>
          </div>
          
          <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
             <div className="text-sm font-bold text-gray-900 mb-4">Kết nối<br/>Mạng xã hội</div>
             <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-400">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">🔗 Kết nối Blog</span>
                   <span>&gt;</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">▶️ Kết nối Youtube</span>
                   <span>&gt;</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">📸 Kết nối Instagram</span>
                   <span>&gt;</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">🎵 Kết nối Tiktok</span>
                   <span>&gt;</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">🔵 Kết nối Facebook</span>
                   <span>&gt;</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded justify-between">
                   <span className="flex items-center gap-2">📍 Kết nối Google Review</span>
                   <span>&gt;</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            {sidebarNav.map((section, i) => (
              <div key={i}>
                <div className="font-bold text-gray-900 text-sm mb-4">{section.title}</div>
                <div className="space-y-1">
                  {section.items.map((item, j) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard/brand' && pathname?.startsWith(item.href));
                    return (
                      <Link 
                        key={j} 
                        href={item.href}
                        className={`flex items-center justify-between text-[13px] py-2 transition-colors ${
                          isActive ? 'text-[#3f51b5] font-bold' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.count !== undefined && <span className="text-gray-400">{item.count}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
