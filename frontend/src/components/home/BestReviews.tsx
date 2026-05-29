'use client';

import Link from 'next/link';

export default function BestReviews() {
  const reviews = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Hải sản ngon - Thưởng thức trọn vị biển...',
      author: 'Phong Nhung_725',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      platform: 'TikTok',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'SAIGON CHERRY - Tặng 3.500.000đ khi tham gia...',
      author: 'NguyễnPhạm_023',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      platform: 'TikTok',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'BIODERMA - Tặng 190.000đ khi mua...',
      author: 'Hà Nhiên',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      platform: 'TikTok',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'DHC - Tặng 399.000đ khi đăng ký...',
      author: 'LinhĐan904',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      platform: 'TikTok',
    },
  ];

  return (
    <section className="py-12 bg-white pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="text-[22px] font-bold text-gray-900 mb-6">Best Reviews</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reviews.map((review) => (
            <Link key={review.id} href={`/reviews/${review.id}`} className="group block">
              <div className="rounded-xl overflow-hidden mb-3 aspect-square relative bg-gray-100">
                <img src={review.image} alt={review.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-[11px] font-medium text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {review.title}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img src={review.authorAvatar} alt={review.author} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] text-gray-500 truncate">{review.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
