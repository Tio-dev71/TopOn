'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState, Suspense } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được trống'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const { data } = await api.post('/auth/login', values);
      if (data.requires2FA) {
        router.push(`/auth/2fa?userId=${data.tempToken}`);
        return;
      }
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Đăng nhập thành công!');

      const role = data.data.user.role;
      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'ADVERTISER') router.push('/dashboard/advertiser');
      else router.push('/dashboard/reviewer');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md bg-white p-10 py-12 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <span className="font-black text-2xl tracking-tighter text-gray-900">TOP ON</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <input
                {...register('email')}
                id="input-email"
                type="email"
                placeholder="Địa chỉ email"
                className={`w-full px-4 py-3 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                {...register('password')}
                id="input-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Mật khẩu"
                className={`w-full px-4 py-3 pr-12 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-between items-center py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-gray-300 text-green-500 focus:ring-green-500" />
              <span className="text-[11px] text-gray-600">Lưu thông tin</span>
            </label>
            <Link href="/auth/forgot-password" className="text-[11px] text-gray-600 hover:text-gray-900 underline">Quên mật khẩu?</Link>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#2563eb] text-white text-sm font-semibold rounded hover:bg-[#1d4ed8] transition-all disabled:opacity-60 flex items-center justify-center mt-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-gray-900">Đăng nhập bằng một cú nhấp chuột</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
              Tiếp tục bằng tài khoản<br />Facebook hoặc Apple ID của bạn.
            </p>
          </div>
          <div className="flex gap-2">
            <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/facebook`} className="w-9 h-9 bg-[#1877F2] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <button className="w-9 h-9 bg-black rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 21.43c-1.442 1.488-2.617 1.444-4.108.627-1.396-.757-2.65-.826-4.19-.015-1.127.585-2.222.755-3.32-.42-6.527-7.072-4.52-16.73 3.1-17.15 1.543-.09 2.91.957 3.86 1.055 1.46-.245 3.03-1.355 4.67-1.16 2.06.183 3.59.957 4.58 2.37-3.9 2.274-3.23 7.644.66 9.176-1.02 2.6-2.18 5.46-4.62 5.534-.23.01-.46-.02-.63-.02zm-3.6-18.73c-.01-2.07 1.83-4.06 4.08-4.2.19 2.22-1.99 4.2-4.08 4.2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <h3 className="text-[13px] font-bold text-gray-900 mb-1">Tham gia đánh giá cùng TopOn!</h3>
          <p className="text-[10px] text-gray-400 mb-4">Tham gia TopOn để có những trải nghiệm đánh giá!</p>
          <Link href="/auth/register" className="block w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50 transition-all text-center">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
