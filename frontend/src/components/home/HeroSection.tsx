'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const statsData = [
  { value: '128', label: 'Campaigns mới', icon: '📢' },
  { value: '1,248', label: 'Review đủ điều kiện', icon: '✅' },
  { value: '12.5M', label: 'Tổng reach', icon: '👁️' },
  { value: '862K', label: 'Tổng engagement', icon: '❤️' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-blue-50/20 pt-4 pb-16">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[520px]">
          {/* Left - Content */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              NỀN TẢNG INFLUENCER MARKETING
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-[52px] font-black text-gray-900 leading-tight mb-4">
              Kết nối thương hiệu với
              <span className="block">
                <span className="gradient-text">Reviewer, KOL & Creator</span>
              </span>
              <span className="block text-gray-900">hiệu quả hơn</span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              TopOn giúp thương hiệu triển khai chiến dịch review, đo lường hiệu quả và tỷ lệ chuyển đổi trên mọi nền tảng mạng xã hội.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Zap, label: 'AI Matching', desc: 'Chọn reviewer thông minh' },
                { icon: TrendingUp, label: 'Báo cáo real-time', desc: 'Theo dõi & kiểm tra' },
                { icon: Shield, label: 'Thanh toán minh bạch', desc: 'Nạp - rút - lịch sử rõ ràng' },
                { icon: Sparkles, label: 'Phê duyệt linh hoạt', desc: 'Approve / Request / Reject' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register?role=ADVERTISER"
                id="cta-create-campaign"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:opacity-95 transition-all"
              >
                Tạo chiến dịch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/campaigns"
                id="cta-explore-campaigns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
              >
                <PlayCircle className="w-4 h-4" />
                Khám phá chiến dịch
              </Link>
            </div>
          </div>

          {/* Right - Dashboard Preview Card */}
          <div className="relative hidden lg:block">
            {/* Main dashboard card */}
            <div className="bg-white rounded-3xl shadow-xl-soft border border-gray-100 p-6 animate-float">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Tổng quan</h3>
                  <p className="text-xs text-gray-400">Chiến dịch tháng này</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {statsData.map((stat) => (
                  <div key={stat.label} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-3 border border-gray-100">
                    <div className="text-lg mb-0.5">{stat.icon}</div>
                    <div className="text-xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini chart simulation */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-4">
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 100, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #FF4D4D${i % 2 === 0 ? 'CC' : '66'}, #FF8C00${i % 2 === 0 ? '88' : '44'})`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">Tháng 1</span>
                  <span className="text-xs text-gray-400">Tháng 12</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-2 animate-pulse-slow">
              <span className="text-lg">🎉</span>
              <div>
                <div className="text-xs font-bold text-gray-800">+128 chiến dịch mới</div>
                <div className="text-xs text-gray-400">trong tuần này</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {['🧑', '👩', '🧑‍💼', '👧'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center border-2 border-white text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">1,264 Reviewer</div>
                <div className="text-xs text-green-500">● Đang hoạt động</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
