'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReviewerProfilePage() {
  const [activeTab, setActiveTab] = useState('basic');

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile/me');
      return data.data;
    },
  });

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    address: '',
    gender: 'Nam',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    city: '',
    district: '',
    addressDetail: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.fullName || '',
        username: profile.username || '',
        phone: profile.phone || '',
        address: profile.address || '',
      }));
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/profile/me', {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success('Lưu thành công!');
      refetch();
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (isLoading) return <div className="py-20 text-center">Đang tải...</div>;

  return (
    <div className="w-full">
      <h2 className="text-[15px] font-bold text-gray-900 border-b border-gray-900 pb-2 mb-6">
        Thông tin
      </h2>

      {/* Tabs */}
      <div className="flex text-[11px] font-bold text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => setActiveTab('basic')}
          className={`flex-1 text-center py-2 border-b-2 ${activeTab === 'basic' ? 'border-[#3f51b5] text-[#3f51b5]' : 'border-gray-100 hover:text-gray-600'}`}
        >
          Thông tin cơ bản<br/><span className="text-[9px] font-normal text-gray-400">Thiết lập mạng xã hội và thêm thông tin cá nhân</span>
        </button>
        <button 
          onClick={() => setActiveTab('additional')}
          className={`flex-1 text-center py-2 border-b-2 ${activeTab === 'additional' ? 'border-[#3f51b5] text-[#3f51b5]' : 'border-gray-100 hover:text-gray-600'}`}
        >
          Thông tin bổ sung<br/><span className="text-[9px] font-normal text-gray-400">Bạn sẽ nhận được số mình có nếu nộp thêm thông tin bổ sung</span>
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          className={`flex-1 text-center py-2 border-b-2 ${activeTab === 'password' ? 'border-[#3f51b5] text-[#3f51b5]' : 'border-gray-100 hover:text-gray-600'}`}
        >
          Thay đổi Mật khẩu<br/><span className="text-[9px] font-normal text-gray-400">Khuyên đổi thường xuyên 6 tháng/1 lần để tăng bảo mật.</span>
        </button>
        <button 
          onClick={() => setActiveTab('social')}
          className={`flex-1 text-center py-2 border-b-2 ${activeTab === 'social' ? 'border-[#3f51b5] text-[#3f51b5]' : 'border-gray-100 hover:text-gray-600'}`}
        >
          Đăng nhập bằng Mạng xã hội<br/><span className="text-[9px] font-normal text-gray-400">Thêm vào tài khoản có thể kết nối với mạng xã hội.</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'basic' && (
          <>
            <div>
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
                Thông tin của tôi
              </h3>
              <div className="space-y-4 text-[11px]">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Địa chỉ email *</label>
                  <input type="email" disabled value={profile?.email || ''} className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none bg-gray-50 text-gray-500" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Biệt danh *</label>
                  <input name="username" value={formData.username} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Giới tính *</label>
                  <div className="flex-1 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={handleChange} className="accent-[#3f51b5]" /> Nam</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={handleChange} className="accent-[#3f51b5]" /> Nữ</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="Khác" checked={formData.gender === 'Khác'} onChange={handleChange} className="accent-[#3f51b5]" /> Khác</label>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Tên *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Số điện thoại *</label>
                  <div className="flex-1 flex gap-2">
                    <select className="px-3 py-2 border border-gray-200 focus:outline-none w-28 bg-white"><option>Vietnam +84</option></select>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Ngày sinh *</label>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <select name="dobDay" onChange={handleChange} className="px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn Ngày</option></select>
                    <select name="dobMonth" onChange={handleChange} className="px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn Tháng</option></select>
                    <select name="dobYear" onChange={handleChange} className="px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn Năm</option></select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0 pt-2">Địa chỉ *</label>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select name="city" onChange={handleChange} className="px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn Thành phố</option></select>
                      <select name="district" onChange={handleChange} className="px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn Quận huyện</option></select>
                    </div>
                    <input name="addressDetail" placeholder="Địa chỉ chi tiết" onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
                Đăng ký
              </h3>
              <div className="space-y-2 text-[11px] text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#3f51b5]" checked readOnly /> Tôi muốn nhận bản tin. <span className="text-gray-400">(Thông báo chiến dịch được gửi tự động.)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#3f51b5]" /> Tôi muốn nhận thông tin qua SMS.
                </label>
              </div>
            </div>
          </>
        )}

        {activeTab === 'additional' && (
          <>
            <div>
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
                Tài khoản
              </h3>
              <div className="space-y-4 text-[11px]">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Tài khoản Ngân hàng *</label>
                  <div className="flex-1 space-y-2">
                    <select className="w-full px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn ngân hàng</option></select>
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Số tài khoản" className="px-3 py-2 border border-gray-200 focus:outline-none" />
                      <input placeholder="Tên chủ tài khoản" className="px-3 py-2 border border-gray-200 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
                Thông tin của tôi
              </h3>
              <div className="space-y-4 text-[11px]">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Nghề nghiệp</label>
                  <select className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Chọn nghề nghiệp</option></select>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0">Ngôn ngữ *</label>
                  <select className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none bg-white"><option value="">Tìm kiếm và thêm Ngôn ngữ</option></select>
                </div>
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0 pt-2">Mối quan tâm</label>
                  <div className="flex-1 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 text-center text-gray-500">
                    <div><div className="w-8 h-8 mx-auto bg-gray-50 border border-gray-200 rounded flex items-center justify-center mb-1 text-[10px]">🏠</div>Nhà Hàng</div>
                    <div><div className="w-8 h-8 mx-auto bg-gray-50 border border-gray-200 rounded flex items-center justify-center mb-1 text-[10px]">✈️</div>Du Lịch</div>
                    <div><div className="w-8 h-8 mx-auto bg-gray-50 border border-gray-200 rounded flex items-center justify-center mb-1 text-[10px]">💄</div>Mỹ Phẩm</div>
                    <div><div className="w-8 h-8 mx-auto bg-gray-50 border border-gray-200 rounded flex items-center justify-center mb-1 text-[10px]">👗</div>Thời Trang</div>
                    {/* Placeholder icons */}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <label className="md:w-32 font-bold text-gray-900 shrink-0 pt-2">Thông tin cá nhân</label>
                  <textarea className="flex-1 px-3 py-2 border border-gray-200 focus:outline-none" rows={4} placeholder="Viết về những thế mạnh của bạn..." />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <div>
            <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
              Thay đổi Mật khẩu
            </h3>
            <div className="space-y-4 text-[11px] max-w-xl">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-32 font-bold text-gray-900 shrink-0">Mật khẩu hiện tại *</label>
                <div className="flex-1 relative">
                  <input type="password" placeholder="Nhập mật khẩu của bạn" className="w-full px-3 py-2 border border-gray-200 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁️</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-32 font-bold text-gray-900 shrink-0">Mật khẩu mới *</label>
                <div className="flex-1 relative">
                  <input type="password" placeholder="Nhập mật khẩu của bạn" className="w-full px-3 py-2 border border-gray-200 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁️</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-32 font-bold text-gray-900 shrink-0">Xác nhận mật khẩu *</label>
                <div className="flex-1 relative">
                  <input type="password" placeholder="Nhập mật khẩu của bạn" className="w-full px-3 py-2 border border-gray-200 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁️</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <h3 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
              Đăng nhập bằng Mạng xã hội
            </h3>
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between border border-gray-100 p-4 rounded-lg bg-white">
                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-700">
                  <span className="text-[#1877f2] text-xl">🔵</span> Kết nối Facebook
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between border border-gray-100 p-4 rounded-lg bg-white">
                <div className="flex items-center gap-3 text-[11px] font-bold text-gray-700">
                  <span className="text-black text-xl"></span> Kết nối Apple ID
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center md:justify-end border-t border-gray-100 pt-6">
          <button type="submit" className="px-10 py-2 bg-[#d1d5db] text-white font-bold text-xs rounded hover:bg-gray-400 transition-colors">
            {activeTab === 'password' ? 'Lưu mật khẩu mới' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
