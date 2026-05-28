'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get(`/blog`); // Ideally, we should have a GET /blog/:slug endpoint. Using list and filtering for demo.
      return data.data.find((p: any) => p.slug === slug);
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 pt-10 pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-3xl mb-8 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!data) return <div className="text-center py-20 font-bold text-gray-500">Không tìm thấy bài viết</div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-20">
        
        {/* Cover Image */}
        {data.coverUrl && (
          <div className="w-full h-[400px] relative">
            <Image src={data.coverUrl} alt={data.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="max-w-3xl mx-auto px-6">
                <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Trở về Blog
                </Link>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                    {data.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  {data.title}
                </h1>
                <div className="flex items-center gap-6 text-sm font-semibold text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {data.author || 'TopOn'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 
                    {data.publishedAt ? format(new Date(data.publishedAt), 'dd MMMM, yyyy', { locale: vi }) : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 py-12">
          
          {!data.coverUrl && (
            <div className="mb-12">
              <Link href="/blog" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 text-sm font-semibold transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Trở về Blog
              </Link>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {data.title}
              </h1>
              <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {data.author || 'TopOn'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 
                  {data.publishedAt ? format(new Date(data.publishedAt), 'dd MMMM, yyyy', { locale: vi }) : ''}
                </div>
              </div>
            </div>
          )}

          {/* Excerpt */}
          {data.excerpt && (
            <div className="text-xl text-gray-600 font-medium leading-relaxed mb-10 pb-10 border-b border-gray-100 italic">
              {data.excerpt}
            </div>
          )}

          {/* Content */}
          <article 
            className="prose prose-lg prose-red max-w-none text-gray-700
              prose-headings:font-bold prose-headings:text-gray-900
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          {/* Share Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="font-bold text-gray-900">Chia sẻ bài viết này</div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
