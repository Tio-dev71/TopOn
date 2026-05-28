'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, X, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdvertiserWalletPage() {
  const [isTopUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: walletData, refetch } = useQuery({
    queryKey: ['my-wallet'],
    queryFn: async () => {
      const { data } = await api.get('/payment/wallet');
      return data.data;
    },
  });

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount < 10000) {
      toast.error('Số tiền tối thiểu là 10,000đ');
      return;
    }
    
    setIsProcessing(true);
    // Giả lập delay chuyển hướng VNPay
    setTimeout(async () => {
      try {
        await api.post('/payment/topup', {
          amount: topUpAmount,
          method: 'VNPAY',
          transactionRef: `VNP${Date.now()}`
        });
        toast.success(`Nạp thành công ${topUpAmount.toLocaleString('vi-VN')}đ`);
        setTopUpModalOpen(false);
        setTopUpAmount('');
        refetch();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Lỗi nạp tiền');
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <div className="bg-white border-b border-gray-100 pt-8 pb-10">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Quản lý Ví</h1>
            <p className="text-gray-500 text-sm">Nạp tiền để thanh toán cho các chiến dịch của bạn.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-gray-300 font-medium">
                    <Wallet className="w-5 h-5" /> Số dư khả dụng
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-wider">VND</div>
                </div>
                <div className="text-5xl font-black mb-2">
                  {(walletData?.balance || 0).toLocaleString('vi-VN')} đ
                </div>
                <div className="text-sm text-gray-400">
                  +{(walletData?.lockedBalance || 0).toLocaleString('vi-VN')} đ đang bị khóa trong chiến dịch
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-center shadow-sm">
              <button
                onClick={() => setTopUpModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity mb-3"
              >
                <ArrowDownCircle className="w-5 h-5" />
                Nạp tiền vào ví
              </button>
              <p className="text-center text-xs text-gray-500 px-4">
                Hỗ trợ VNPay, thẻ tín dụng và chuyển khoản ngân hàng.
              </p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Lịch sử giao dịch</h2>
            <div className="space-y-4">
              {walletData?.transactions?.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Chưa có giao dịch nào</div>
              ) : (
                walletData?.transactions?.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {tx.amount > 0 ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{tx.description}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{new Date(tx.createdAt).toLocaleString('vi-VN')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="text-xs text-gray-400 font-medium">Số dư: {tx.balanceAfter.toLocaleString('vi-VN')} đ</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setTopUpModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 text-center border-b border-gray-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Nạp tiền VNPay</h2>
              <p className="text-sm text-gray-500 mt-1">Giao dịch an toàn và bảo mật</p>
            </div>
            
            <form onSubmit={handleTopUp} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền muốn nạp (VND)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value) || '')}
                    className="w-full text-lg font-bold pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    placeholder="100,000"
                    required
                    min="10000"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">VNĐ</div>
                </div>
              </div>

              {/* Pre-defined amounts */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[100000, 500000, 1000000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className="py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {(amt/1000)}K
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-green-600 bg-green-50 py-3 rounded-xl mb-6">
                <ShieldCheck className="w-4 h-4" /> Được bảo vệ bởi VNPay
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán qua VNPay'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
