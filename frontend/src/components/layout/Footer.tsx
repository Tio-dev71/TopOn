import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

const footerLinks = {
  'Nền tảng': [
    { label: 'Dành cho Brand', href: '/for-brands' },
    { label: 'Dành cho Creator', href: '/for-creators' },
    { label: 'Tính năng', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Trang trợ giúp', href: '/help' },
  ],
  'Chính sách': [
    { label: 'Điều khoản dịch vụ', href: '/terms' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
    { label: 'Chính sách hoàn tiền', href: '/refund' },
    { label: 'Quy tắc cộng đồng', href: '/community' },
  ],
  'Tài nguyên': [
    { label: 'TopOn Blog', href: '/blog' },
    { label: 'Hướng dẫn sử dụng', href: '/guides' },
    { label: 'Thương hiệu tham gia', href: '/brands' },
    { label: 'Liên hệ', href: '/contact' },
  ],
};

const stats = [
  { value: '1,493,492', label: 'Influencer' },
  { value: '1,264,824', label: 'Reviewer / Trusted reviewer' },
  { value: '10,916,008', label: 'Review' },
  { value: '2008+', label: 'Brand' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Stats Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/topon.PNG" alt="TopOn Logo" width={140} height={40} className="h-9 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              TopOn là nền tảng kết nối Influencer Marketing hàng đầu, giúp thương hiệu tiếp cận đúng đối tượng thông qua Reviewer, KOL & Creator.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-500 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2025 TopOn Corporation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Bảo mật</Link>
            <span className="text-sm text-gray-500">🇻🇳 Tiếng Việt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
