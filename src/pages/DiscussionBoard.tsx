import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'business' | 'client';
  content: string;
  timestamp: Date;
  author: string;
}

const ORION_LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_93063fdc.png';

export function DiscussionBoard() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'client',
      content: '我們需要一個能夠處理大規模數據的架構系統',
      timestamp: new Date(Date.now() - 3600000),
      author: '客戶 - 張先生',
    },
    {
      id: '2',
      type: 'business',
      content: '我們可以為你設計一個可擴展的微服務架構，支援高並發處理',
      timestamp: new Date(Date.now() - 1800000),
      author: '業務 - 李經理',
    },
    {
      id: '3',
      type: 'client',
      content: '預算大約是多少？',
      timestamp: new Date(Date.now() - 600000),
      author: '客戶 - 張先生',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'business',
        content: inputValue,
        timestamp: new Date(),
        author: '業務 - 你',
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${ORION_LOGO_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(201, 168, 76, 0.1) 25%, rgba(201, 168, 76, 0.1) 26%, transparent 27%, transparent 74%, rgba(201, 168, 76, 0.1) 75%, rgba(201, 168, 76, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(201, 168, 76, 0.1) 25%, rgba(201, 168, 76, 0.1) 26%, transparent 27%, transparent 74%, rgba(201, 168, 76, 0.1) 75%, rgba(201, 168, 76, 0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
            animation: 'scanDown 8s linear infinite',
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="border-b border-gold-border backdrop-blur-sm bg-black/30 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="orion-title text-2xl mb-1">{t('discussion.title')}</h1>
            <p className="orion-subtitle text-gold">{t('discussion.subtitle')}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-6xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-text-secondary">
                <p className="text-center">{t('discussion.noMessages')}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'business' ? 'justify-end' : 'justify-start'} animate-fadeUp`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg border backdrop-blur-sm ${
                      message.type === 'business'
                        ? 'bg-gold-bg border-gold-border ml-auto'
                        : 'bg-black/40 border-cyan/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="orion-label text-xs">
                        {message.type === 'business' ? t('discussion.yourMessage') : t('discussion.clientMessage')}
                      </span>
                      <span className="text-text-tertiary text-xs ml-2">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-text-primary text-sm mb-1">{message.content}</p>
                    <p className="text-text-tertiary text-xs">{message.author}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gold-border backdrop-blur-sm bg-black/30 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('discussion.placeholder')}
                className="flex-1 bg-raised border border-gold-border rounded px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="orion-btn-fill px-6 py-2 flex items-center gap-2 hover:shadow-lg hover:shadow-gold/30 transition-all"
              >
                <Send size={16} />
                <span className="hidden sm:inline">{t('discussion.send')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-gold/30 rounded-full animate-pulse" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-gold/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}
