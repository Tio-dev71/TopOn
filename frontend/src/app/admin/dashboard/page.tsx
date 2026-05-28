'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, BarChart3, CreditCard, Flag, CheckCircle, XCircle, Search, ShieldAlert, ArrowRight, UserCheck, Briefcase, FileEdit, Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import Image from 'next/image';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'withdrawals' | 'blog'>('overview');
  const [blogModal, setBlogModal] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', coverUrl: '', category: 'Hướng dẫn', author: 'TopOn Admin', isPublished: false });

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.data;
    }
  });

  const { data: withdrawals, refetch: refetchWithdrawals } = useQuery({
    queryKey: ['admin', 'withdrawals'],
    queryFn: async () => {
      const { data } = await api.get('/admin/withdrawals');
      return data.data;
    }
  });

  const { data: blogs, refetch: refetchBlogs } = useQuery({
    queryKey: ['admin', 'blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blog?all=true&limit=100');
      return data.data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.data;
    },
    enabled: activeTab === 'users'
  });

  const handleApproveWithdrawal = async (id: string) => {
    if (!confirm('Xác nhận đã chuyển tiền thành công cho yêu cầu này?')) return;
    try {
      await api.patch(`/admin/withdrawals/${id}`, { status: 'DONE', adminNote: 'Đã xử lý' });
      refetchWithdrawals();
    } catch (e) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const note = prompt('Lý do từ chối?');
    if (!note) return;
    try {
      await api.patch(`/admin/withdrawals/${id}`, { status: 'FAILED', adminNote: note });
      refetchWithdrawals();
    } catch (e) {
      toast.error('Lỗi khi xử lý yêu cầu rút tiền');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (blogModal.data) {
        await api.put(`/blog/${blogModal.data.id}`, blogForm);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await api.post('/blog', blogForm);
        toast.success('Tạo bài viết thành công');
      }
      setBlogModal({ isOpen: false });
      refetchBlogs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi lưu bài viết');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Xóa thành công');
      refetchBlogs();
    } catch (err) {
      toast.error('Lỗi xóa bài viết');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pb-20">
        {/* Admin Header */}
        <div className="bg-gray-900 text-white pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 text-blue-400 font-medium text-sm mb-2">
              <ShieldAlert className="w-5 h-5" />
              BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN
            </div>
            <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
                { id: 'users', label: 'Quản lý Users', icon: Users },
                { id: 'withdrawals', label: 'Yêu cầu rút tiền', icon: CreditCard },
                { id: 'blog', label: 'Bài viết (Blog)', icon: FileEdit },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" /> Tổng Users
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stats?.users?.total || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-500" /> Reviewers
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stats?.users?.reviewers || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" /> Thương hiệu
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stats?.users?.advertisers || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-blue-500" /> Chiến dịch
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stats?.campaigns?.total || 0}</div>
                </div>
              </div>

              {/* Recent Withdrawals (Overview) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Yêu cầu rút tiền chờ xử lý</h3>
                  <button onClick={() => setActiveTab('withdrawals')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {withdrawals?.filter((w: any) => w.status === 'PENDING').length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Không có yêu cầu rút tiền nào cần xử lý.</div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals?.filter((w: any) => w.status === 'PENDING').slice(0, 5).map((w: any) => (
                      <div key={w.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <div className="font-bold text-gray-900">{w.amount?.toLocaleString('vi-VN')}đ</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {w.wallet?.user?.profile?.fullName || w.wallet?.user?.email} • {w.bankName} - {w.accountNumber}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveWithdrawal(w.id)} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors" title="Đã chuyển tiền">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w.id)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors" title="Từ chối">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Quản lý người dùng</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Tìm kiếm email..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Người dùng</th>
                      <th className="px-4 py-3">Vai trò</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Ngày tham gia</th>
                      <th className="px-4 py-3 rounded-tr-lg text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users?.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                              {user.profile?.avatarUrl ? <Image src={user.profile.avatarUrl} alt="" fill className="object-cover" /> : <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{user.email[0].toUpperCase()}</div>}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.profile?.fullName || 'Chưa cập nhật'}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                            user.role === 'REVIEWER' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'ADVERTISER' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-800 text-white'
                          }`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          {user.isActive ? (
                            <span className="text-green-600 font-medium text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Hoạt động</span>
                          ) : (
                            <span className="text-blue-600 font-medium text-xs flex items-center gap-1"><XCircle className="w-3 h-3"/> Khóa</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-blue-600 font-medium text-xs hover:underline">Chi tiết</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tất cả yêu cầu rút tiền</h3>
              <div className="space-y-4">
                {withdrawals?.map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-2xl">
                        💳
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-lg">{w.amount?.toLocaleString('vi-VN')} đ</div>
                        <div className="text-sm font-medium text-gray-700 mt-0.5">
                          {w.bankName} • {w.accountNumber} • {w.accountName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{w.wallet?.user?.profile?.fullName || w.wallet?.user?.email}</span>
                          <span>•</span>
                          <span>{format(new Date(w.createdAt), 'HH:mm dd/MM/yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {w.status === 'PENDING' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveWithdrawal(w.id)} className="px-4 py-2 bg-green-500 text-white font-bold text-sm rounded-lg hover:bg-green-600 transition-colors">
                            Xác nhận chuyển
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w.id)} className="px-4 py-2 bg-white text-blue-600 border border-blue-200 font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors">
                            Từ chối
                          </button>
                        </div>
                      ) : w.status === 'DONE' ? (
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 font-bold text-xs rounded-lg flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 font-bold text-xs rounded-lg flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Đã từ chối
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* TAB: BLOG */}
          {activeTab === 'blog' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Quản lý Blog & Tips</h3>
                <button 
                  onClick={() => {
                    setBlogForm({ title: '', slug: '', excerpt: '', content: '', coverUrl: '', category: 'Hướng dẫn', author: 'TopOn Admin', isPublished: false });
                    setBlogModal({ isOpen: true });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Thêm bài viết mới
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
                      <th className="pb-3 pl-4">Bài viết</th>
                      <th className="pb-3">Danh mục</th>
                      <th className="pb-3">Trạng thái</th>
                      <th className="pb-3">Ngày đăng</th>
                      <th className="pb-3 text-right pr-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {blogs?.map((blog: any) => (
                      <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="font-bold text-gray-900 truncate max-w-xs">{blog.title}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{blog.slug}</div>
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-700">{blog.category}</td>
                        <td className="py-4">
                          {blog.isPublished ? (
                            <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg">Đã xuất bản</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">Bản nháp</span>
                          )}
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <button 
                            onClick={() => {
                              setBlogForm({ 
                                title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', 
                                content: blog.content || '', coverUrl: blog.coverUrl || '', 
                                category: blog.category, author: blog.author || '', isPublished: blog.isPublished 
                              });
                              setBlogModal({ isOpen: true, data: blog });
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {blogs?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-500">Chưa có bài viết nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Blog Modal */}
      {blogModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative my-8">
            <button 
              onClick={() => setBlogModal({ isOpen: false })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors z-10"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900">{blogModal.data ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h2>
            </div>
            
            <form onSubmit={handleSaveBlog} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề</label>
                  <input required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                  <input required value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="vi-du-bai-viet" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục</label>
                  <input required value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả</label>
                  <input value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ảnh bìa (URL)</label>
                <input value={blogForm.coverUrl} onChange={e => setBlogForm({...blogForm, coverUrl: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full px-4 py-2 border rounded-xl" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung (HTML/Markdown)</label>
                <textarea required value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-4 py-2 border rounded-xl font-mono text-sm" rows={8} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPublished" checked={blogForm.isPublished} onChange={e => setBlogForm({...blogForm, isPublished: e.target.checked})} className="w-4 h-4 text-blue-500 rounded" />
                <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700">Xuất bản bài viết này</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setBlogModal({ isOpen: false })} className="px-6 py-2 rounded-xl border border-gray-200 font-semibold">Hủy</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold">Lưu bài viết</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
