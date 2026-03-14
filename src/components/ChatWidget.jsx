import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { MessageCircle, X, Send, Brain, Loader, Sparkles } from 'lucide-react';

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm SmartEMI Advisor 👋 I know your complete financial profile. Ask me anything about your loans, EMIs, savings, or how to become debt-free faster!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(() => !localStorage.getItem('chat_hint_seen'));
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const dismissHint = () => {
    localStorage.setItem('chat_hint_seen', 'true');
    setShowHint(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await client.post(`/api/users/${user.id}/chat`, {
        message: userMsg.content,
        history: messages.slice(-6)
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Try again in a moment."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "When will I be debt-free?",
    "Which loan should I pay first?",
    "Can I afford a new loan?",
    "How much am I saving monthly?",
    "What is my DTI ratio?",
    "How can I reduce my EMI burden?",
  ];

  return (
    <>
      {/* Hint tooltip */}
      {showHint && !open && (
        <div className="fixed bottom-28 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-2xl w-72"
          style={{ animation: 'bounce 2s infinite' }}>
          <button
            onClick={dismissHint}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 hover:bg-slate-700 rounded-full text-white text-xs flex items-center justify-center"
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-yellow-300" />
            <p className="font-bold text-sm">Ask SmartEMI Advisor!</p>
          </div>
          <p className="text-indigo-200 text-xs mb-3">
            I know your complete financial profile. Ask me anything!
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 2).map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); setOpen(true); dismissHint(); }}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating button with pulse */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-40 animate-ping" />
        )}
        <button
          onClick={() => { setOpen(o => !o); dismissHint(); }}
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            open
              ? 'bg-red-500 hover:bg-red-600 scale-95'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110'
          }`}
        >
          {open
            ? <X size={24} className="text-white" />
            : <MessageCircle size={24} className="text-white" />
          }
        </button>
        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </span>
        )}
      </div>

      {/* Chat window — bigger */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden"
          style={{ width: '420px', height: '560px', maxWidth: 'calc(100vw - 48px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white">SmartEMI Advisor</p>
              <p className="text-indigo-200 text-xs">AI-powered • Knows your finances</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain size={14} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <Brain size={14} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs text-gray-400 mb-2 font-medium">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 items-center">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about your finances..."
              className="flex-1 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition active:scale-95"
            >
              <Send size={17} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}