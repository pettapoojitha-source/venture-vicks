import { useState, useRef, useEffect } from 'react';
import { Venture } from '../types';
import { chatWithWicksAiApi } from '../lib/api';
import { 
  Sparkles, 
  X, 
  Send, 
  RefreshCw, 
  Flame, 
  Bot, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface WicksAiDrawerProps {
  venture: Venture | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function WicksAiDrawer({ venture }: WicksAiDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Greetings founder. I am Wicks AI, your venture strategic sparring partner. I analyze your pitch with institutional rigor without ever inventing fake metrics or ungrounded claims. How can I help sharpen ${venture ? venture.name : 'your venture'} today?`,
      timestamp: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do I defend our unit economics to a skeptical VC?',
    'What is our single biggest defensibility blindspot?',
    'Suggest a tighter 1-sentence elevator pitch',
    'Audit our competitor differentiation'
  ];

  const handleSend = async (userText: string) => {
    const query = userText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const reply = await chatWithWicksAiApi(query, history, venture?.questionnaire);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an issue connecting to the venture engine. However, remember the golden rule of pitching: always anchor your defense strictly in what you have verified with real customers.',
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          id="btn-open-wicks-ai"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#191716] hover:bg-[#2F2925] text-white shadow-xl border border-[#3E3832] flex items-center gap-2.5 group transition-all hover:scale-103"
        >
          <div className="w-5 h-5 rounded-full bg-[#FAF0E4] flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-[#D96B27]" />
          </div>
          <span className="text-xs font-semibold">Ask Wicks AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-[#FAF8F5] border border-[#DDD5C9] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
          {/* Drawer Header */}
          <div className="p-4 bg-white border-b border-[#ECE4DA] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FCECDD] flex items-center justify-center border border-[#F3D3B8]">
                <Flame className="w-4 h-4 text-[#D96B27]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#191716] flex items-center gap-1.5">
                  <span>Wicks AI Sparring Partner</span>
                </div>
                <div className="text-[10px] text-[#786E63]">
                  {venture ? `Context: ${venture.name}` : 'General Startup Strategy'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#8A8177] hover:text-[#191716] rounded-md hover:bg-[#F2ECE3] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                      isUser
                        ? 'bg-[#191716] text-white rounded-br-none'
                        : 'bg-white text-[#2E2824] border border-[#E5DFD7] rounded-bl-none shadow-2xs font-sans'
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[9px] text-[#A89F93] mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#7A7167] text-xs bg-white p-2.5 rounded-lg border border-[#E8DFD4] w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D96B27]" />
                <span>Formulating grounded VC critique...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-3 py-2 bg-[#F6F2EC] border-t border-[#E8DFD4] overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-white border border-[#DDD5C9] text-[#544C44] rounded-full text-[10px] whitespace-nowrap hover:border-[#D96B27] hover:text-[#191716] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-[#ECE4DA] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for feedback or strategic critique..."
              className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:outline-hidden focus:border-[#D96B27]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-md bg-[#191716] text-white hover:bg-[#332E2A] disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
