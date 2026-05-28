import { Users, Bot, BarChart2, CreditCard, Lock, HeartHandshake, BookOpen, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Nguồn Reviewer đa dạng',
    desc: 'KOL, KOC, Micro & Nano Creator phù hợp cho mọi ngành hàng.',
    color: 'from-blue-500 to-blue-500',
  },
  {
    icon: Bot,
    title: 'AI Matching thông minh',
    desc: 'Theo dõi nội dung, đề xuất tối ưu chiến lược, tối ưu hiệu quả.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: BarChart2,
    title: 'Báo cáo & đo lường real-time',
    desc: 'Theo dõi reach, engagement, chi phí phân tích theo thời gian thực.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: CreditCard,
    title: 'Phê duyệt nội dung linh hoạt',
    desc: 'Approve / Request changes / Reject dễ dàng.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Lock,
    title: 'Thanh toán minh bạch',
    desc: 'Nạp - rút - lịch sử thanh toán rõ ràng, an toàn bảo mật.',
    color: 'from-blue-500 to-blue-500',
  },
  {
    icon: HeartHandshake,
    title: 'Hỗ trợ tận tâm',
    desc: 'Đội ngũ hỗ trợ 24/7 trong suốt chiến dịch.',
    color: 'from-pink-500 to-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Tips & Guides hữu ích',
    desc: 'Kho tài liệu, mẹo hay cho cả Creator & Brand.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Lightbulb,
    title: 'Gợi ý sáng tạo từ AI',
    desc: 'Gợi ý thay đổi budget / kênh khi chỉ số thấp.',
    color: 'from-teal-500 to-cyan-500',
  },
];

export default function WhyTopOn() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Vì sao chọn <span className="gradient-text">TopOn</span>?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Nền tảng toàn diện giúp thương hiệu và creator hợp tác hiệu quả và minh bạch
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">{feature.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
