import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-black">T</span>
          </div>
          <span className="font-black text-xl text-gray-900">topON</span>
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
