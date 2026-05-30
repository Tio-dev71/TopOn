'use client';

import { useState } from 'react';
import { Check, ChevronDown, Camera, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateCampaignWizard() {
  const [step, setStep] = useState(1);

  // --- Common UI for Stepper ---
  const STEP_TITLES = [
    'Thông tin cơ bản',
    'Yêu cầu review',
    'Quyền lợi & ngân sách',
    'Tiêu chí reviewer',
    'Xác nhận & thanh toán'
  ];

  const Stepper = () => (
    <div className="mb-8">
      <h2 className="text-[15px] font-bold text-gray-900 mb-6">Tạo chiến dịch mới</h2>
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
        {STEP_TITLES.map((title, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isPassed = step > stepNum;
          return (
            <div key={stepNum} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive || isPassed ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                <span className={`text-[11px] ${isActive ? 'text-gray-900 font-bold border-b-2 border-[#2563eb] pb-1' : 'text-gray-400'}`}>
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- Step 1 ---
  const Step1 = () => (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-[13px] font-bold text-gray-900 mb-6">Bước 1: Thông tin cơ bản</h3>
      <div className="border border-gray-100 rounded-lg p-6 bg-white space-y-8">
        
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2">Tên chiến dịch</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] focus:outline-none" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2">Loại chiến dịch</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="border border-gray-100 rounded p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2563eb] relative">
               <span className="text-2xl">🛍️</span>
               <span className="text-[11px] font-bold text-gray-700">Sản phẩm</span>
             </div>
             <div className="border border-gray-100 rounded p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2563eb] relative">
               <span className="text-2xl">💆</span>
               <span className="text-[11px] font-bold text-gray-700">Dịch vụ</span>
             </div>
             <div className="border border-[#2563eb] rounded p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-green-50/30 relative">
               <span className="text-2xl">🏪</span>
               <span className="text-[11px] font-bold text-gray-700">Địa điểm</span>
               <span className="text-[9px] text-gray-500">🏢 ABC Coffee</span>
               <div className="absolute top-2 right-2 w-4 h-4 bg-[#2563eb] rounded text-white flex items-center justify-center">
                 <Check className="w-3 h-3" />
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-sm">
           <div className="flex items-center justify-between">
             <span className="text-[11px] font-bold text-gray-700">Reviewer có thể tự trải nghiệm trước?</span>
             <div className="flex items-center gap-2">
               <div className="w-10 h-5 bg-[#2563eb] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
               </div>
               <span className="text-[11px] text-gray-600 w-8">Có</span>
             </div>
           </div>
           <div className="flex items-center justify-between">
             <span className="text-[11px] font-bold text-gray-700">Chiến dịch thanh toán thù lao</span>
             <div className="flex items-center gap-2">
               <div className="w-10 h-5 bg-[#2563eb] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
               </div>
               <span className="text-[11px] text-gray-600 w-8">Không</span>
             </div>
           </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2">Tiến độ chiến dịch</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] appearance-none focus:outline-none bg-white">
              <option>Chọn tiến độ</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

      </div>
      <div className="flex justify-between mt-6">
        <button className="px-6 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors">
          Hủy bỏ
        </button>
        <button onClick={() => setStep(2)} className="px-6 py-2 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors">
          Bước tiếp theo
        </button>
      </div>
    </div>
  );

  // --- Step 2 ---
  const Step2 = () => (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-[13px] font-bold text-gray-900 mb-6">Bước 2: Yêu cầu review</h3>
      <div className="border border-gray-100 rounded-lg p-6 bg-white space-y-8">
        
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2">Yêu cầu chi tiết cho Reviewer</label>
          <textarea rows={4} className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] focus:outline-none"></textarea>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2">Từ khóa bắt buộc</label>
          <div className="w-full border border-gray-200 rounded p-2 flex flex-wrap gap-2 items-center bg-white min-h-[42px]">
            <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#ABC</span>
            <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#Revu</span>
            <input type="text" className="flex-1 min-w-[100px] border-none focus:outline-none text-[11px]" />
            <button className="text-gray-400 hover:text-gray-600 ml-auto"><Camera className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-4">Kênh review phù hợp</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
               <label className="flex items-center gap-2 bg-[#e6f6f0] px-3 py-2 rounded border border-[#2563eb] cursor-pointer">
                 <div className="w-4 h-4 rounded border border-[#2563eb] bg-[#2563eb] text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
                 <span className="text-[11px] font-bold text-gray-800">Facebook</span>
               </label>
               <label className="flex items-center gap-2 bg-[#e6f6f0] px-3 py-2 rounded border border-[#2563eb] cursor-pointer">
                 <div className="w-4 h-4 rounded border border-[#2563eb] bg-[#2563eb] text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
                 <span className="text-[11px] font-bold text-gray-800">TikTok</span>
               </label>
               <label className="flex items-center gap-2 bg-[#e6f6f0] px-3 py-2 rounded border border-[#2563eb] cursor-pointer">
                 <div className="w-4 h-4 rounded border border-[#2563eb] bg-[#2563eb] text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
                 <span className="text-[11px] font-bold text-gray-800">Instagram</span>
               </label>
               <label className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-white cursor-pointer hover:border-[#2563eb]">
                 <div className="w-4 h-4 rounded border border-gray-300 bg-white"></div>
                 <span className="text-[11px] font-bold text-gray-600">YouTube</span>
               </label>
               <label className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-white cursor-pointer hover:border-[#2563eb]">
                 <div className="w-4 h-4 rounded border border-gray-300 bg-white"></div>
                 <span className="text-[11px] font-bold text-gray-600">Blog</span>
               </label>
            </div>
          </div>
          <div className="space-y-4">
             <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-2">Số ảnh tối thiểu</label>
                <div className="flex">
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l text-[11px] focus:outline-none" />
                  <span className="px-3 py-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-[11px] rounded-r">ảnh</span>
                </div>
             </div>
             <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-2">Độ dài nội dung tối thiểu</label>
                <div className="flex">
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l text-[11px] focus:outline-none" />
                  <span className="px-3 py-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-[11px] rounded-r">ký tự</span>
                </div>
             </div>
          </div>
        </div>

      </div>
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(1)} className="px-6 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors">
          Quay lại
        </button>
        <button onClick={() => setStep(3)} className="px-6 py-2 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors">
          Bước tiếp theo
        </button>
      </div>
    </div>
  );

  // --- Step 3 ---
  const Step3 = () => (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-[13px] font-bold text-gray-900 mb-6">Bước 3: Quyền lợi & ngân sách</h3>
      <div className="border border-gray-100 rounded-lg p-6 bg-white space-y-8">
        
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">Quyền lợi dành cho Reviewer?</label>
          <div className="flex gap-8 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="reward" className="hidden" />
              <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center"></div>
              <span className="text-[11px] font-bold text-gray-600">Sản phẩm/trải nghiệm</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="reward" defaultChecked className="hidden" />
              <div className="w-10 h-5 bg-[#2563eb] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
              <span className="text-[11px] font-bold text-gray-900">Thù lao</span>
            </label>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-2">Số tiền thù lao</label>
            <div className="flex max-w-sm">
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l text-[11px] focus:outline-none" />
              <span className="px-3 py-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-[11px] rounded-r">VNĐ (đ)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">Ngân sách chiến dịch</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] text-gray-500 mb-2">Số Reviewer dự kiến</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] appearance-none focus:outline-none bg-white">
                  <option></option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-2">Tổng ngân sách dự kiến</label>
              <div className="flex">
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l text-[11px] focus:outline-none bg-gray-50" readOnly />
                <span className="px-3 py-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-[11px] rounded-r">VND</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded">
             <div className="p-3 bg-gray-50 text-[10px] font-bold text-gray-500 flex justify-between border-b border-gray-100">
               <span>Sản phẩm/trải nghiệm</span>
               <span>Chi phí ước tính</span>
             </div>
             <div className="p-3 text-[11px] font-bold text-gray-800 flex justify-between">
               <span>Combo trải nghiệm</span>
               <span>1.000.000 <span className="text-gray-400 font-normal">VND</span></span>
             </div>
          </div>
        </div>

      </div>
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(2)} className="px-6 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors">
          Quay lại
        </button>
        <button onClick={() => setStep(4)} className="px-6 py-2 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors">
          Bước tiếp theo
        </button>
      </div>
    </div>
  );

  // --- Step 4 ---
  const Step4 = () => (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-[13px] font-bold text-gray-900 mb-6">Bước 4: Tiêu chí reviewer</h3>
      <div className="border border-gray-100 rounded-lg p-6 bg-white space-y-8">
        
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">Bộ lọc mạng xã hội</label>
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded border border-[#2563eb] bg-[#2563eb] text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
              <span className="text-[11px] font-bold text-gray-800">Facebook</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded border border-[#2563eb] bg-[#2563eb] text-white flex items-center justify-center"><Check className="w-3 h-3" /></div>
              <span className="text-[11px] font-bold text-gray-800">Dịch vụ</span>
            </label>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-2">Số follower tối thiểu:</label>
            <div className="flex max-w-[200px]">
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l text-[11px] focus:outline-none" />
              <span className="px-3 py-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-500 text-[11px] rounded-r">VND (đ)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">Tiêu chí khác (Tùy chọn)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] text-gray-500 mb-2">Độ tuổi tối thiểu: 18</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] appearance-none focus:outline-none bg-white">
                  <option></option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-2">Giới tính: Không Phân biệt</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] appearance-none focus:outline-none bg-white">
                  <option></option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
             <label className="block text-[10px] font-bold text-gray-700 mb-2">Từ khóa loại Reviewer:</label>
             <div className="w-full border border-gray-200 rounded p-2 flex flex-wrap gap-2 items-center bg-gray-50 min-h-[42px]">
               <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#cà phê</span>
               <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#ẩm thực</span>
               <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#Hà Nội</span>
               <span className="bg-[#e6f6f0] text-[#2563eb] px-2 py-1 rounded text-[10px] font-bold">#chụp ảnh</span>
             </div>
          </div>

          <button className="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-[10px] rounded flex items-center gap-2 hover:bg-gray-50 transition-colors bg-white">
            + Thêm quyền lợi khác
          </button>
        </div>

      </div>
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(3)} className="px-6 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors">
          Quay lại
        </button>
        <button onClick={() => setStep(5)} className="px-6 py-2 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors">
          Bước tiếp theo
        </button>
      </div>
    </div>
  );

  // --- Step 5 ---
  const Step5 = () => (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-[13px] font-bold text-gray-900 mb-6">Bước 5: Xác nhận & thanh toán</h3>
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1 & 2 */}
          <div className="space-y-6">
            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/50">
              <h4 className="text-[11px] font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">Thông tin chiến dịch</h4>
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
                <span>📝</span> Review Quán ABC
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-gray-900 font-bold">Bực tắt:</div>
                <ul className="list-disc pl-4 text-[10px] text-gray-600">
                  <li>Thù lao: 500,000đ</li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/50">
              <h4 className="text-[11px] font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">Tiêu chí reviewer</h4>
              <ul className="list-disc pl-4 text-[10px] text-gray-600 space-y-1">
                <li>Tối thiểu 1,000 subscriber (TikTok, Instagram)</li>
                <li>Độ tuổi từ 18 trở lên</li>
              </ul>
            </div>
          </div>

          {/* Box 3 */}
          <div>
            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/50 h-full">
              <h4 className="text-[11px] font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Ngân sách chiến dịch</h4>
              <div className="text-2xl font-bold text-gray-900 mb-1">5,000,000 <span className="text-[11px] text-gray-500 font-normal">VND</span></div>
              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-[10px] text-gray-600 border-b border-gray-200 pb-2">
                  <span>Số lượng Reviewer dự kiến</span>
                  <span className="font-bold text-gray-900">10</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 border-b border-gray-200 pb-2">
                  <span>Chi phí quyền lợi khác:</span>
                  <span className="font-bold text-gray-900">~ 1,000,000 VND</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 border-b border-gray-200 pb-2">
                  <span>Chi phí thù lao:</span>
                  <span className="font-bold text-gray-900">5,000,000 VND</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600">
                  <span>Chi phí dịch vụ:</span>
                  <span className="font-bold text-gray-900">Miễn phí*</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Box */}
        <div className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm mt-6">
          <h4 className="text-[11px] font-bold text-gray-900 mb-4">Nạp ngân sách cho chiến dịch?</h4>
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-1.5 border border-[#c1c9f4] text-[#3f51b5] font-bold text-[10px] rounded bg-white flex items-center gap-1">
              VND (đ) <span className="w-4 h-3 bg-red-500 ml-1 rounded-sm text-[8px] text-yellow-300 flex items-center justify-center">⭐</span>
            </button>
            <button className="px-4 py-1.5 border border-gray-200 text-gray-400 font-bold text-[10px] rounded bg-gray-50">
              USD ($)
            </button>
          </div>
          <button className="w-full py-3 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors mb-3">
            Nạp nhanh 5,000,000đ để triển khai chiến dịch
          </button>
          <div className="text-[10px] text-gray-500 hover:text-gray-900 cursor-pointer">+ Nạp số tiền khác</div>
          <div className="text-[8px] text-gray-400 mt-6">* Revu hoàn toàn miễn khoản phí dịch vụ và Chính sách của Revu</div>
        </div>

      </div>
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(4)} className="px-6 py-2 border border-gray-200 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-50 transition-colors">
          Quay lại
        </button>
        <button className="px-6 py-2 bg-[#2563eb] text-white font-bold text-[11px] rounded hover:bg-blue-700 transition-colors">
          Nạp ngân sách & Đăng ký
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <Stepper />
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <Step5 />}
    </div>
  );
}
