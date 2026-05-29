'use client';

import Link from 'next/link';

export default function BlogPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Link href="/blog" className="block relative bg-gradient-to-r from-[#eef7ff] to-[#e6f0fa] rounded-2xl p-8 md:p-12 overflow-hidden group hover:shadow-md transition-shadow border border-[#dbeaf5]">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left flex-1">
                 <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">TOPON Blog</h2>
                 <p className="text-sm text-gray-500">Nhận thêm thông tin về Influencer trên TOPON Blog.</p>
              </div>
              <div className="flex gap-4 items-center">
                 <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 transform rotate-[-2deg] group-hover:rotate-0 transition-transform">
                    <div className="w-16 h-16 bg-gray-100 rounded object-cover overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Blog 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <div className="text-[10px] font-bold text-gray-900 mb-1">TOPON Blog ♥</div>
                       <div className="text-[9px] text-gray-400">Tham gia TOPON Review</div>
                    </div>
                 </div>
                 <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 transform rotate-[2deg] group-hover:rotate-0 transition-transform hidden sm:flex opacity-70">
                    <div className="w-16 h-16 bg-gray-100 rounded object-cover overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Blog 2" className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>
           </div>
        </Link>
      </div>
    </section>
  );
}
