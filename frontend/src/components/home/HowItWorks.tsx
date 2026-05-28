import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Tạo chiến dịch',
    desc: 'Điền thông tin chiến dịch, mục tiêu, yêu cầu và các nội dung bạn muốn tạo.',
    icon: '✍️',
    color: 'from-blue-500 to-blue-500',
  },
  {
    number: '02',
    title: 'Chọn Reviewer phù hợp',
    desc: 'Theo dõi danh sách Reviewer phù hợp nhất với AI Matching.',
    icon: '🎯',
    color: 'from-purple-500 to-blue-500',
  },
  {
    number: '03',
    title: 'Theo dõi & Thanh toán',
    desc: 'Theo dõi tiến trình, phê duyệt nội dung & thanh toán minh bạch.',
    icon: '📊',
    color: 'from-green-500 to-teal-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-white mb-3">Cách hoạt động</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Chỉ 3 bước đơn giản để bắt đầu chiến dịch Influencer Marketing thành công</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-7 hover:border-gray-600 transition-all group">
                {/* Number badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white font-black text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>

                <div className="text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                  Bước {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all hover:shadow-xl text-sm"
          >
            Bắt đầu miễn phí ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
