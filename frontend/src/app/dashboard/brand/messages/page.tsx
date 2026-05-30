'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Phone, Mail, MoreVertical, Paperclip, Send, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { io as socketIo, Socket } from 'socket.io-client';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  reviewer: {
    id: string;
    user: { profile?: { fullName?: string; avatarUrl?: string } };
  };
  campaign?: { title: string };
  lastMessage?: string;
  updatedAt: string;
  unread?: number;
}

export default function BrandMessagesPage() {
  const { user } = useAuthStore();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [search, setSearch] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['brand-conversations'],
    queryFn: async () => {
      const { data } = await api.get('/messages/conversations');
      return data.data as Conversation[];
    },
  });

  const conversations = (conversationsData || []).filter((c: Conversation) => {
    const name = c.reviewer?.user?.profile?.fullName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const activeConversation = conversations.find((c: Conversation) => c.id === activeConversationId);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    api.get(`/messages/conversations/${activeConversationId}/messages`).then(({ data }) => {
      setMessages(data.data || []);
    });
  }, [activeConversationId]);

  // Socket.io for real-time
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const socket = socketIo(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => { socket.disconnect(); };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMsg.trim() || !activeConversationId) return;
    const content = inputMsg;
    setInputMsg('');
    try {
      const { data } = await api.post(`/messages/conversations/${activeConversationId}/messages`, { content });
      setMessages(prev => [...prev, data.data]);
    } catch {
      setInputMsg(content);
    }
  };

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[11px] border border-gray-200 rounded focus:outline-none bg-gray-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#2563eb]" />
            </div>
          )}
          {!isLoading && conversations.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-[11px]">
              Chưa có cuộc trò chuyện nào
            </div>
          )}
          {conversations.map((conv: Conversation) => {
            const name = conv.reviewer?.user?.profile?.fullName || 'Reviewer';
            const avatar = conv.reviewer?.user?.profile?.avatarUrl;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-50 ${activeConversationId === conv.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0 border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {avatar ? (
                    <Image src={avatar} alt={name} fill className="object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[12px] font-bold text-gray-900 truncate">{name}</div>
                    <div className="text-[9px] text-gray-400 shrink-0">
                      {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-gray-500 truncate">{conv.lastMessage || conv.campaign?.title || ''}</div>
                    {(conv.unread || 0) > 0 && (
                      <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Chat Window */}
      {!activeConversationId ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
          <div className="text-4xl">💬</div>
          <div className="text-[12px]">Chọn một cuộc trò chuyện để bắt đầu</div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-gray-50/30">
          {/* Chat Header */}
          <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full relative overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {activeConversation?.reviewer?.user?.profile?.avatarUrl ? (
                  <Image src={activeConversation.reviewer.user.profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div>
                <div className="text-[12px] font-bold text-gray-900 flex items-center gap-2">
                  {activeConversation?.reviewer?.user?.profile?.fullName || 'Reviewer'}
                  <span className="text-[9px] font-normal text-[#3f51b5] bg-blue-50 px-1.5 py-0.5 rounded">Reviewer</span>
                </div>
                <div className="text-[10px] text-gray-500">{activeConversation?.campaign?.title || ''}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-gray-600"><Phone className="w-4 h-4" /></button>
              <button className="hover:text-gray-600"><Mail className="w-4 h-4" /></button>
              <button className="hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-[11px] py-8">Chưa có tin nhắn nào</div>
            )}
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col gap-1 max-w-[80%] ${isMine ? 'items-end self-end ml-auto' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg text-[11px] shadow-sm leading-relaxed ${
                    isMine
                      ? 'bg-[#e8ebff] text-[#3f51b5] rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
              <button className="text-gray-400 hover:text-gray-600 p-1"><Paperclip className="w-4 h-4" /></button>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-transparent border-none focus:outline-none text-[11px]"
              />
              <button
                onClick={sendMessage}
                className="bg-[#3f51b5] text-white p-1.5 rounded hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
