import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/topon.PNG" alt="TopOn Logo" width={250} height={40} className="h-16 w-auto object-contain" priority />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Đăng nhập
          </Link>
          <Link href="/register" className="text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  )
}
