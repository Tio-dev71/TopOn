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
        <div className="bg-white border-b border-gray-100 pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              Tin tức & Kiến thức
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">TopOn Blog</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Cập nhật những xu hướng Influencer Marketing mới nhất, case study thành công và cẩm nang dành cho cả Brands lẫn Creators.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-white rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Chưa có bài viết nào.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.data?.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all block">
                  <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                    {post.coverUrl ? (
                      <Image 
                        src={post.coverUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMMM, yyyy', { locale: vi }) : ''}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author || 'TopOn'}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                      Đọc tiếp <ChevronRight className="w-4 h-4 ml-1" />
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
