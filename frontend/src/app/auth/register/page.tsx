'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useState, Suspense } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
  role: z.enum(['REVIEWER', 'ADVERTISER']),
  agree: z.boolean().refine((v) => v, 'Bạn cần đồng ý điều khoản'),
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'REVIEWER' | 'ADVERTISER') || 'REVIEWER';
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, agree: false },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: RegisterForm) => {
    try {
      const { fullName, email, password, role } = values;
      await api.post('/auth/register', { fullName, email, password, role });
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email xác thực.');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-red-50/20 to-blue-50/10 px-6 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-black">T</span>
        </div>
        <span className="font-black text-2xl text-gray-900">topON</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Tạo tài khoản</h1>
        <p className="text-gray-500 text-sm mb-7">Tham gia cùng 1.4M+ Influencer & Thương hiệu</p>

        {/* Role selector */}
        <div className="flex gap-3 mb-6 p-1 bg-gray-100 rounded-2xl">
          {[
            { value: 'REVIEWER', label: '👤 Tôi là Reviewer / Creator' },
            { value: 'ADVERTISER', label: '🏢 Tôi là Thương hiệu' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${selectedRole === opt.value ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              <input {...register('role')} type="radio" value={opt.value} className="hidden" />
              {opt.label}
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {selectedRole === 'ADVERTISER' ? 'Tên công ty' : 'Họ và tên'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('fullName')}
                id="input-fullname"
                placeholder={selectedRole === 'ADVERTISER' ? 'Tên công ty của bạn' : 'Nguyễn Văn A'}
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all ${errors.fullName ? 'border-blue-300' : 'border-gray-200'}`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-blue-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email')}
                id="input-email"
                type="email"
                placeholder="email@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all ${errors.email ? 'border-blue-300' : 'border-gray-200'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-blue-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('password')}
                id="input-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Ít nhất 8 ký tự"
                className={`w-full pl-10 pr-12 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all ${errors.password ? 'border-blue-300' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-blue-500 mt-1">{errors.password.message}</p>}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register('agree')} id="input-agree" type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-200" />
            <span className="text-xs text-gray-500 leading-relaxed">
              Tôi đồng ý với{' '}
              <Link href="/terms" className="text-blue-600 font-medium hover:underline">Điều khoản dịch vụ</Link>
              {' '}và{' '}
              <Link href="/privacy" className="text-blue-600 font-medium hover:underline">Chính sách bảo mật</Link>
              {' '}của TopOn
            </span>
          </label>
          {errors.agree && <p className="text-xs text-blue-500">{errors.agree.message}</p>}

          <button
            type="submit"
            id="btn-register-submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Tạo tài khoản <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* OAuth */}
        <div className="relative flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/google`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-sm text-gray-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </a>
          <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/facebook`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-sm text-gray-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">Đăng nhập</Link>
        </p>
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
