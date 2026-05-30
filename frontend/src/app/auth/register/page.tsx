'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState, Suspense } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
  confirmPassword: z.string(),
  gender: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterPageContent() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      const { email, phone, password, gender } = values;
      // We send REVIEWER as default role for this page
      await api.post('/auth/register', { email, phone, password, gender, role: 'REVIEWER' });
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email xác thực.');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
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
            <div className="relative flex">
              <span className="inline-flex items-center px-4 border border-r-0 border-gray-200 rounded-l text-sm text-gray-500 bg-gray-50">
                +84
              </span>
              <input
                {...register('phone')}
                id="input-phone"
                type="tel"
                placeholder="Số điện thoại"
                className={`w-full px-4 py-3 border rounded-r text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                {...register('password')}
                id="input-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Mật khẩu (nhiều hơn 8 ký tự)"
                className={`w-full px-4 py-3 pr-12 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                id="input-confirm-password"
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className={`w-full px-4 py-3 pr-12 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <div className="relative">
              <select
                {...register('gender')}
                id="input-gender"
                className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all text-gray-500 appearance-none bg-white"
              >
                <option value="">Giới tính (Tùy chọn)</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 my-4 text-center">
            *Mã xác thực sẽ được gửi đến email của bạn để kích hoạt.
          </p>

          <button
            type="submit"
            id="btn-register-submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#2563eb] text-white text-sm font-semibold rounded hover:bg-[#1d4ed8] transition-all disabled:opacity-60 flex items-center justify-center mt-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              'Tham gia'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-gray-900">Đăng ký bằng một cú nhấp chuột</h3>
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
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Bạn đã có tài khoản ?</h3>
          <Link href="/auth/login" className="block w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50 transition-all text-center">
            Đăng nhập
          </Link>
          <p className="text-[10px] text-gray-400 mt-6 leading-tight max-w-[280px] mx-auto">
            Với việc đăng ký, bạn đồng ý với<br />
            Điều khoản sử dụng, Chính sách sử dụng và Chính sách Sử Dụng Nền Tảng
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
