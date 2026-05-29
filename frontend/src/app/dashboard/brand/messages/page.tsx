'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Phone, Mail, MoreVertical, Paperclip, Smile, Send } from 'lucide-react';

const DUMMY_CHATS = [
  { id: 1, name: 'Huy Trần', campaign: 'Review Quán ABC', time: '10:24', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', unread: 0 },
  { id: 2, name: 'Linh Nguyễn', campaign: 'Mỹ phẩm SOME BY MI', time: 'Hôm qua', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', unread: 2 },
  { id: 3, name: 'Lê Dũng', campaign: 'Review Cửa hàng XYZ', time: 'Hôm qua', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', unread: 0 },
];

export default function BrandMessagesPage() {
  const [activeChatId, setActiveChatId] = useState(1);

  return (
    <div className="w-full h-[600px] border border-gray-100 rounded-lg bg-white flex overflow-hidden shadow-sm">
      
      {/* Left: Chat List */}
      <div className="w-80 border-r border-gray-100 flex flex-col shrink-0 bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm trò chuyện..." 
              className="w-full pl-9 pr-4 py-2 text-[11px] border border-gray-200 rounded focus:outline-none bg-gray-50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {DUMMY_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-50 ${activeChatId === chat.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
            >
              <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0 border border-gray-200">
                <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[12px] font-bold text-gray-900 truncate">{chat.name}</div>
                  <div className="text-[9px] text-gray-400 shrink-0">{chat.time}</div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="text-[10px] text-gray-500 truncate">{chat.campaign}</div>
                   {chat.unread > 0 && (
                     <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                       {chat.unread}
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full relative overflow-hidden border border-gray-200">
                <Image src={DUMMY_CHATS.find(c => c.id === activeChatId)?.avatar || ''} alt="Avatar" fill className="object-cover" />
             </div>
             <div>
                <div className="text-[12px] font-bold text-gray-900 flex items-center gap-2">
                  {DUMMY_CHATS.find(c => c.id === activeChatId)?.name}
                  <span className="text-[9px] font-normal text-[#3f51b5] bg-blue-50 px-1.5 py-0.5 rounded">Reviewer</span>
                </div>
                <div className="text-[10px] text-gray-500">{DUMMY_CHATS.find(c => c.id === activeChatId)?.campaign}</div>
             </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
             <button className="hover:text-gray-600"><Phone className="w-4 h-4" /></button>
             <button className="hover:text-gray-600"><Mail className="w-4 h-4" /></button>
             <button className="hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="text-[9px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Hôm nay, 10:24</span>
          </div>
          
          <div className="flex flex-col gap-1 max-w-[80%] items-start">
             <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-[11px] text-gray-700 shadow-sm leading-relaxed">
               Chào bạn, mình đã cập nhật thêm hình ảnh theo yêu cầu nhé. Bạn check giúp mình ạ!
             </div>
             <span className="text-[8px] text-gray-400 ml-1">10:24</span>
          </div>

          <div className="flex flex-col gap-1 max-w-[80%] items-end self-end ml-auto">
             <div className="bg-[#e8ebff] text-[#3f51b5] p-3 rounded-lg rounded-tr-none text-[11px] shadow-sm leading-relaxed">
               Ok bạn, nội dung và hình ảnh đã đạt yêu cầu rồi nhé. Cảm ơn bạn. Mình sẽ duyệt luôn trên hệ thống.
             </div>
             <span className="text-[8px] text-gray-400 mr-1">10:26</span>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
            <button className="text-gray-400 hover:text-gray-600 p-1"><Paperclip className="w-4 h-4" /></button>
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[11px]"
            />
            <button className="text-gray-400 hover:text-gray-600 p-1"><Smile className="w-4 h-4" /></button>
            <button className="bg-[#3f51b5] text-white p-1.5 rounded hover:bg-blue-700 transition-colors">
               <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
