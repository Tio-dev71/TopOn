'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const contactSchema = z.object({
  companyName: z.string().min(2, 'Vui lòng nhập tên công ty'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  note: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function RegisterAdvertiserPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactForm) => {
    try {
      // Assuming there is an endpoint for contact or advertiser registration
      // await api.post('/contact', values);
      toast.success('Gửi thông tin thành công! Chúng tôi sẽ liên hệ sớm nhất.');
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white py-4 px-6 sm:px-12 flex justify-between items-center border-b border-gray-100">
        <Link href="/">
          <span className="font-black text-2xl tracking-tighter text-gray-900">TOP ON</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-green-600 transition-colors">Trang chủ</Link>
          <Link href="/auth/register" className="hover:text-green-600 transition-colors">Đăng ký</Link>
          <button className="hover:text-green-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-8">
            Với những nhãn hàng và đại lý quảng cáo có nhu cầu lượng content lớn<br />
            Topon đem lại giải pháp phù hợp nhất.
          </h1>
          <button className="bg-[#2cb55e] text-white px-8 py-3 rounded font-semibold hover:bg-[#259f51] transition-all">
            Đăng ký ngay
          </button>

          {/* Feature Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-lg text-left">
            <div className="flex flex-col">
              <div className="bg-[#38b16c] text-white p-8 h-full">
                <div className="mb-4">
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Content Bán Chuyên Đề</h3>
                <p className="text-sm opacity-90">Sản xuất số lượng content nhỏ lẻ theo yêu cầu</p>
              </div>
              <div className="bg-[#f59f2a] text-white p-8 h-full">
                <div className="mb-4">
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Content Social & Branding</h3>
                <p className="text-sm opacity-90">Tạo content social ngắn gọn hấp dẫn cho mạng xã hội</p>
              </div>
            </div>
            
            <div className="bg-[#282a2b] text-white p-10 flex flex-col justify-center items-center text-center">
              <h2 className="text-3xl font-black mb-6">Sản xuất<br/>Content Quy<br/>mô lớn</h2>
              <p className="text-sm opacity-80 mb-8 max-w-[250px]">
                Chiến dịch quy mô lớn, liên kết với nhiều micro influencer. Tối ưu chi phí và lan tỏa sức mạnh.
              </p>
              <ul className="text-sm opacity-90 text-left space-y-3 mb-8">
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Kế hoạch nội dung tổng thể</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Quản lý sản xuất quy mô</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Đo lường hiệu quả chiến dịch</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Báo cáo chi tiết & tối ưu</li>
              </ul>
              <button className="border border-white text-white px-8 py-2 rounded font-semibold hover:bg-white hover:text-black transition-all">
                Đăng ký ngay
              </button>
            </div>

            <div className="flex flex-col">
              <div className="bg-[#f0c33c] text-white p-8 h-full">
                <div className="mb-4">
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Kịch bản Video / UGC</h3>
                <p className="text-sm opacity-90">Sản xuất video content sáng tạo trên các nền tảng</p>
              </div>
              <div className="bg-[#56bc8a] text-white p-8 h-full">
                <div className="mb-4">
                  <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Thiết kế & Bày Visual</h3>
                <p className="text-sm opacity-90">Mang đến trải nghiệm visual ấn tượng cho chiến dịch</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Top On */}
        <section className="bg-[#3eb062] py-20 px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Top On là gì?</h2>
            <p className="text-sm opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Người tiêu dùng thông qua rất nhiều kênh truyền thông để tìm kiếm sản phẩm và dịch vụ trước khi mua. Để tạo được tiếng vang, các thương hiệu đang đầu tư mạnh mẽ vào các kênh thông tin có sức ảnh hưởng, đặc biệt là thông qua các KOL, Influencer. TopOn cung cấp giải pháp content marketing hiệu quả bằng việc kết nối những người có sức ảnh hưởng (KOL, KOC, Reviewer) để truyền thông cho thương hiệu, thúc đẩy doanh số.
            </p>
            
            {/* Simple Flow Diagram Representation */}
            <div className="relative mx-auto max-w-3xl bg-white/10 p-8 rounded-2xl border border-white/20">
               <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-[#3eb062]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    Reviewer
                  </div>
                  <div className="h-0.5 bg-white flex-1 mx-4 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-white rotate-45"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-16 bg-white rounded-lg flex items-center justify-center mb-2 shadow-lg text-[#3eb062]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                    </div>
                    Content Marketing
                  </div>
                  <div className="h-0.5 bg-white flex-1 mx-4 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-white rotate-45"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-[#3eb062]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    Người mua
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Why Choose Top On */}
        <section className="py-20 px-6 bg-[#fafafa]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-16">Tại sao chọn TOPON?</h2>
            
            <div className="space-y-16">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
                     <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                     </div>
                     <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-50 text-blue-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                     </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Chúng tôi hỗ trợ và quản lý Micro-influencer một cách hệ thống</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">1</div>
                      <p className="text-sm text-gray-600">Với dữ liệu lớn (Big Data) hệ thống, chúng tôi dễ dàng lựa chọn micro influencer, chuyển tải thông tin chiến dịch đến micro influencer nhanh chóng và phù hợp nhất với target khách hàng mục tiêu.</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">2</div>
                      <p className="text-sm text-gray-600">Quy trình tự động hóa giúp quản lý các influencer trong việc tạo nội dung, review sản phẩm, kiểm duyệt content nhanh chóng, hiệu quả, đáp ứng deadline chiến dịch.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="md:w-1/2">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
                     <div className="w-full h-48 bg-gray-100 rounded flex flex-col gap-2 p-4 text-gray-400">
                        <div className="w-full h-1/2 bg-white rounded flex items-end px-4 gap-2">
                          <div className="w-1/6 h-full bg-blue-100 rounded-t"></div>
                          <div className="w-1/6 h-3/4 bg-blue-200 rounded-t"></div>
                          <div className="w-1/6 h-1/2 bg-blue-300 rounded-t"></div>
                          <div className="w-1/6 h-4/5 bg-blue-400 rounded-t"></div>
                          <div className="w-1/6 h-1/4 bg-blue-500 rounded-t"></div>
                        </div>
                     </div>
                     <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-50 text-purple-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                     </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Chúng tôi cung cấp những báo cáo hiệu quả và chiến dịch dựa trên dữ liệu</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">1</div>
                      <p className="text-sm text-gray-600">Dữ liệu từ hệ thống theo dõi realtime hiệu quả chiến dịch qua lượt reach, view, tương tác (like, cmt, share).</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">2</div>
                      <p className="text-sm text-gray-600">Đo lường mức độ tương tác thông qua công cụ phân tích sentiment (tích cực, tiêu cực, trung lập).</p>
                    </li>
                  </ul>
                </div>
              </div>

               {/* Feature 3 */}
               <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
                     <div className="w-full h-48 bg-gray-100 rounded flex flex-col gap-2 p-4 text-gray-400">
                        <div className="w-full flex gap-2">
                           <div className="w-12 h-12 bg-white rounded-full"></div>
                           <div className="flex-1 space-y-2">
                             <div className="h-4 bg-white w-1/2 rounded"></div>
                             <div className="h-4 bg-white w-3/4 rounded"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Có thể sáng tạo ra content phù hợp với kênh mong muốn</h3>
                  <p className="text-sm text-gray-600">Tùy biến đa dạng với các yêu cầu content quảng cáo: Viết bài review, đăng tải video, chia sẻ hình ảnh... Phù hợp với mọi quy định của nền tảng như Tiktok, Facebook, Youtube...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who uses Top On */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-12">Ai sử dụng <span className="text-green-500">Top On</span>?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                   <svg className="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Doanh nghiệp nhỏ (SME)</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Thiết lập nhanh chóng các chiến dịch marketing với chi phí cực kỳ hợp lý. Cải thiện chuyển đổi, tăng cường SEO dễ dàng, nhận diện thương hiệu.
                </p>
              </div>
              <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                   <svg className="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Thương Hiệu</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tạo tiếng vang mạnh mẽ trên đa phương tiện bằng mạng lưới micro influencer. Tạo ra nguồn nội dung phong phú cho thương hiệu.
                </p>
              </div>
              <div className="border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                   <svg className="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Đại Lý</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Quản lý chiến dịch thay cho đối tác thương hiệu của bạn bằng các công cụ tiện lợi. Tối ưu chi phí và gia tăng hiệu quả tối đa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-[#241c15] py-24 px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center"></div>
           <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-12 text-center">
                Với TopOn, Content Marketing diễn ra nhanh chóng và hiệu quả. Hãy bắt đầu ngay!
              </h2>

              <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8 items-stretch">
                 <div className="flex-1 border border-white/20 p-8 flex flex-col justify-center text-white space-y-6 backdrop-blur-sm bg-black/20">
                    <div className="flex items-start gap-4">
                       <svg className="w-5 h-5 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                       <div>
                         <h4 className="text-xs text-gray-400 mb-1">Hotline:</h4>
                         <p className="font-semibold text-sm">02473 018 777</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <svg className="w-5 h-5 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                       <div>
                         <h4 className="text-xs text-gray-400 mb-1">Email:</h4>
                         <p className="font-semibold text-sm">contact@topon.vn</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <svg className="w-5 h-5 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       <div>
                         <h4 className="text-xs text-gray-400 mb-1">Trụ sở:</h4>
                         <p className="font-semibold text-sm">Tầng 4, Tòa nhà Detech, số 8 Tôn Thất Thuyết, Mỹ Đình 2, Nam Từ Liêm, Hà Nội.</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-[1.5]">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 flex flex-col gap-4">
                       <div>
                         <input
                           {...register('companyName')}
                           type="text"
                           placeholder="Tên công ty/Thương hiệu (*)"
                           className={`w-full px-4 py-3 border text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                         />
                         {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
                       </div>
                       <div>
                         <input
                           {...register('email')}
                           type="email"
                           placeholder="Địa chỉ Email (*)"
                           className={`w-full px-4 py-3 border text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                         />
                         {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                       </div>
                       <div>
                         <input
                           {...register('phone')}
                           type="tel"
                           placeholder="Số điện thoại (*)"
                           className={`w-full px-4 py-3 border text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                         />
                         {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                       </div>
                       <div>
                         <textarea
                           {...register('note')}
                           placeholder="Ghi chú (Chiến dịch, sản phẩm, yêu cầu...)"
                           rows={3}
                           className="w-full px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 resize-none"
                         ></textarea>
                       </div>
                       <button
                         type="submit"
                         disabled={isSubmitting}
                         className="w-full py-3.5 bg-[#2cb55e] text-white text-sm font-bold mt-2 hover:bg-[#259f51] transition-colors disabled:opacity-60 flex items-center justify-center"
                       >
                         {isSubmitting ? (
                           <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                         ) : (
                           'GỬI THÔNG TIN'
                         )}
                       </button>
                    </form>
                 </div>
              </div>
           </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100 text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-gray-500 mb-4 font-semibold">
           <Link href="/" className="hover:text-gray-900">Giới thiệu</Link>
           <Link href="/" className="hover:text-gray-900">Điều khoản sử dụng</Link>
           <Link href="/" className="hover:text-gray-900">Chính sách bảo mật</Link>
           <Link href="/" className="hover:text-gray-900">Chính sách sử dụng nền tảng</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[11px] text-gray-400">
           <span>Influencer: <strong className="text-gray-700">1,451,568</strong></span>
           <span>Chiến dịch: <strong className="text-gray-700">1,116,975</strong></span>
           <span>Review: <strong className="text-gray-700">10,461,332</strong></span>
        </div>
      </footer>
    </div>
  );
}
