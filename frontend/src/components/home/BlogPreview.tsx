'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function BlogPreview() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog', 'preview'],
    queryFn: async () => {
      const { data } = await api.get('/blog?limit=3');
      return data.data;
    },
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">TopOn Blog</div>
            <h2 className="text-2xl font-black text-gray-900">Cập nhật xu hướng, chiến lược và case study về Influencer Marketing</h2>
          </div>
          <Link href="/blog" className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 ml-8">
            Khám phá ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts?.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.coverUrl ? (
                      <Image src={post.coverUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-100" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-medium">{post.author}</span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: vi })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
