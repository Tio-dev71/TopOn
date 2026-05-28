'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Save, User, Instagram, Youtube, Facebook, MapPin, Phone, CheckCircle, Upload } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import toast from 'react-hot-toast';

const CATEGORIES = ['Làm đẹp', 'Du lịch', 'Ẩm thực', 'Lifestyle', 'Công nghệ', 'Thời trang', 'Nhà bếp', 'Giải trí'];

export default function ReviewerProfilePage() {
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile/me');
      return data.data;
    },
  });

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phone: '',
    address: '',
    igHandle: '',
    tiktokHandle: '',
    ytHandle: '',
    fbHandle: '',
    followersIg: 0,
    followersTiktok: 0,
    followersYt: 0,
    engagementRate: 0,
    specialties: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        address: profile.address || '',
        igHandle: profile.reviewerProfile?.igHandle || '',
        tiktokHandle: profile.reviewerProfile?.tiktokHandle || '',
        ytHandle: profile.reviewerProfile?.ytHandle || '',
        fbHandle: profile.reviewerProfile?.fbHandle || '',
        followersIg: profile.reviewerProfile?.followersIg || 0,
        followersTiktok: profile.reviewerProfile?.followersTiktok || 0,
        followersYt: profile.reviewerProfile?.followersYt || 0,
        engagementRate: profile.reviewerProfile?.engagementRate || 0,
        specialties: profile.reviewerProfile?.specialties || [],
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const toggleSpecialty = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Update basic profile
      await api.put('/profile/me', {
        fullName: formData.fullName,
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address,
      });

      // 2. Update reviewer specific data
      await api.put('/profile/reviewer/social', {
        igHandle: formData.igHandle,
        tiktokHandle: formData.tiktokHandle,
        ytHandle: formData.ytHandle,
        fbHandle: formData.fbHandle,
        followersIg: formData.followersIg,
        followersTiktok: formData.followersTiktok,
        followersYt: formData.followersYt,
        engagementRate: formData.engagementRate,
        specialties: formData.specialties,
      });

      toast.success('Cập nhật hồ sơ thành công!');
      refetch();
    } catch (err) {
      toast.error('Lỗi khi cập nhật hồ sơ');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 pt-8 pb-8">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Hồ sơ cá nhân</h1>
            <p className="text-gray-500 text-sm">Quản lý thông tin và số liệu mạng xã hội của bạn để thu hút nhiều nhãn hàng hơn.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Basic Info */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Thông tin cơ bản
              </h2>
              
              <div className="flex gap-8 mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 relative overflow-hidden flex-shrink-0 group">
                  {profile?.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">
                      {formData.fullName?.[0] || 'R'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Giới thiệu ngắn (Bio)</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" placeholder="Hãy viết gì đó về bạn..." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Phone className="w-4 h-4"/> Số điện thoại</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Địa chỉ</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>

            {/* 2. Lĩnh vực */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Lĩnh vực hoạt động (Specialties)</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleSpecialty(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                      formData.specialties.includes(cat) 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Social Stats */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Số liệu mạng xã hội (Nhập tay)</h2>
              <p className="text-gray-500 text-sm mb-6">Hãy cập nhật số liệu chính xác để được các thương hiệu chú ý tới.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* TIKTOK */}
                <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl">
                  <div className="font-bold mb-4 flex items-center gap-2">🎵 TikTok</div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Handle (@username)</label>
                      <input name="tiktokHandle" value={formData.tiktokHandle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="@" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Followers</label>
                      <input name="followersTiktok" type="number" min="0" value={formData.followersTiktok} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </div>

                {/* IG */}
                <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl">
                  <div className="font-bold mb-4 flex items-center gap-2 text-pink-600"><Instagram className="w-4 h-4" /> Instagram</div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Handle (@username)</label>
                      <input name="igHandle" value={formData.igHandle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="@" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Followers</label>
                      <input name="followersIg" type="number" min="0" value={formData.followersIg} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Youtube & FB */}
                <div className="space-y-4">
                   <div className="font-bold flex items-center gap-2 text-blue-600"><Youtube className="w-4 h-4"/> YouTube</div>
                   <input name="ytHandle" value={formData.ytHandle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Channel Link or Handle" />
                   <input name="followersYt" type="number" min="0" value={formData.followersYt} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Subscribers" />
                </div>

                <div className="space-y-4">
                   <div className="font-bold flex items-center gap-2 text-blue-600"><Facebook className="w-4 h-4"/> Facebook</div>
                   <input name="fbHandle" value={formData.fbHandle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Profile/Page Link" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="max-w-xs">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tỷ lệ tương tác chung (Engagement Rate %)</label>
                  <input name="engagementRate" type="number" step="0.1" min="0" max="100" value={formData.engagementRate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" className="px-6 py-3 font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                <Save className="w-5 h-5" />
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
