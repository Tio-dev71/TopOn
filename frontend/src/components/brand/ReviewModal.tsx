'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewerName: string;
  reviewerUsername: string;
  reviewerAvatar: string;
  campaignName: string;
}

export default function ReviewModal({ isOpen, onClose, reviewerName, reviewerUsername, reviewerAvatar, campaignName }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const [criteria, setCriteria] = useState({
    onTime: true,
    correctBrief: true,
    goodAttitude: true,
    considerDeadline: false,
    incorrectContent: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#fcfdfd] w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-800">Đánh giá Reviewer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          
          {/* Reviewer Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded relative overflow-hidden border border-gray-100">
              <Image src={reviewerAvatar} alt={reviewerName} fill className="object-cover" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-gray-800">{reviewerName}</div>
              <div className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center text-[8px] text-gray-600">✓</span>
                @{reviewerUsername}
              </div>
              <div className="text-[11px] text-gray-500 mb-2">Chiến dịch: {campaignName}</div>
              
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-gray-800">Mức độ:</span>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 cursor-pointer" 
                      fill={star <= rating ? 'currentColor' : 'none'} 
                      onClick={() => setRating(star)} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-[12px] font-bold text-gray-800 mb-2">
              Nhận xét của bạn <span className="text-gray-400 font-normal">(không bắt buộc)</span>
            </label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-24 border border-purple-100/50 rounded-lg p-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white"
              style={{ boxShadow: '0 0 10px rgba(200, 200, 255, 0.1)' }}
            />
            <div className="text-[10px] text-gray-400 mt-1">Nhận xét này chỉ hiển thị cho hệ thống & reviewer</div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${criteria.onTime ? 'bg-[#00a65a] border-[#00a65a] text-white' : 'border-gray-300 bg-white group-hover:border-[#00a65a]'}`}>
                {criteria.onTime && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[12px] text-gray-600 font-semibold">Giao bài đúng hạn</span>
              <input type="checkbox" className="hidden" checked={criteria.onTime} onChange={() => setCriteria({...criteria, onTime: !criteria.onTime})} />
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${criteria.considerDeadline ? 'bg-[#00a65a] border-[#00a65a] text-white' : 'border-gray-300 bg-white group-hover:border-[#00a65a]'}`}>
                {criteria.considerDeadline && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[12px] text-gray-600 font-semibold">Cân nhắc deadline</span>
              <input type="checkbox" className="hidden" checked={criteria.considerDeadline} onChange={() => setCriteria({...criteria, considerDeadline: !criteria.considerDeadline})} />
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${criteria.correctBrief ? 'bg-[#00a65a] border-[#00a65a] text-white' : 'border-gray-300 bg-white group-hover:border-[#00a65a]'}`}>
                {criteria.correctBrief && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[12px] text-gray-600 font-semibold">Nội dung đúng brief</span>
              <input type="checkbox" className="hidden" checked={criteria.correctBrief} onChange={() => setCriteria({...criteria, correctBrief: !criteria.correctBrief})} />
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${criteria.incorrectContent ? 'bg-[#00a65a] border-[#00a65a] text-white' : 'border-gray-300 bg-white group-hover:border-[#00a65a]'}`}>
                {criteria.incorrectContent && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[12px] text-gray-600 font-semibold">Nội dung chưa đúng yêu cầu</span>
              <input type="checkbox" className="hidden" checked={criteria.incorrectContent} onChange={() => setCriteria({...criteria, incorrectContent: !criteria.incorrectContent})} />
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${criteria.goodAttitude ? 'bg-[#00a65a] border-[#00a65a] text-white' : 'border-gray-300 bg-white group-hover:border-[#00a65a]'}`}>
                {criteria.goodAttitude && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[12px] text-gray-600 font-semibold">Thái độ hợp tác tốt</span>
              <input type="checkbox" className="hidden" checked={criteria.goodAttitude} onChange={() => setCriteria({...criteria, goodAttitude: !criteria.goodAttitude})} />
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-600 font-bold text-[11px] rounded hover:bg-gray-200 transition-colors">
              Hủy
            </button>
            <button className="px-6 py-2 bg-[#00a65a] text-white font-bold text-[11px] rounded hover:bg-green-600 transition-colors">
              Lưu đánh giá
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
