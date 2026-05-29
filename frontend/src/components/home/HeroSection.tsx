'use client';

export default function HeroSection() {
  return (
    <section className="bg-white pt-6 pb-2">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Banner Placeholder based on design */}
        <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gradient-to-r from-[#6b46c1] to-[#4c1d95] rounded-2xl overflow-hidden relative flex items-center shadow-md">
           {/* Simulated banner content based on the purple banner in design */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center"></div>
           <div className="relative z-10 px-8 md:px-16 text-white w-full flex justify-between items-center">
              <div className="max-w-md">
                 <div className="inline-block bg-white text-purple-900 font-bold px-3 py-1 rounded text-xs mb-4">TRIỂN KHAI CHIẾN DỊCH</div>
                 <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                   Tặng bộ dầu gội + ủ trị<br/>
                   giá <span className="text-yellow-400">400.000đ</span> khi mua<br/>
                   sản phẩm trên
                 </h2>
                 <p className="text-sm opacity-90">KHÔNG YÊU CẦU LƯỢT FOLLOW</p>
              </div>
              <div className="hidden md:block">
                 <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-inner" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
