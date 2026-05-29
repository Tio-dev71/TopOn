'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronRight, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function BlogListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blog', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/blog');
      return data;
    },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50 pb-20">
        <div className="bg-white pt-8 pb-4">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tất cả bài viết</h1>
            <div className="relative max-w-xs w-full">
              <input type="text" placeholder="Tìm kiếm bài viết..." className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Chưa có bài viết nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.data?.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-xl overflow-hidden mb-3 border border-gray-100 relative shadow-sm">
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      {post.coverUrl ? (
                        <Image 
                          src={post.coverUrl} 
                          alt={post.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50" />
                      )}
                      {post.category && (
                        <div className="absolute top-0 left-0 bg-[#3f51b5] text-white text-[10px] font-semibold px-3 py-1 rounded-br-lg">
                          {post.category}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-900 mb-1.5 group-hover:text-[#3f51b5] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center text-[10px] text-gray-500">
                      <span>
                        Ngày {post.publishedAt ? format(new Date(post.publishedAt), 'dd/MM/yyyy', { locale: vi }) : '...'} tác giả {post.author || 'TopOn'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
