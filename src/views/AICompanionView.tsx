import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  CalendarClock,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { api } from '../api/client';
import { AIChatMessage, Task, UserProfile } from '../types';

interface AICompanionViewProps {
  profile: UserProfile | null;
  onScheduleExtractedTask: (task: Partial<Task>) => void;
  onOpenVoiceModal: () => void;
}

export const AICompanionView: React.FC<AICompanionViewProps> = ({
  profile,
  onScheduleExtractedTask,
  onOpenVoiceModal,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Vanakkam ${profile?.name || 'Machi'}! I am Taskora AI, your personal productivity companion. 🌟\n\nNee English, Tamil, or Tanglish-la enna vena kettu planning pannalaam. Enna task innaiku or future-ku plan pannanum?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send to server-side Gemini 3.8 Flash endpoint
      const res = await api.chatWithAI(text, messages);

      // Check if this message involves creating or rescheduling a task
      let action: any = null;
      const lower = text.toLowerCase();
      if (
        lower.includes('java') ||
        lower.includes('padikanum') ||
        lower.includes('project') ||
        lower.includes('submission') ||
        lower.includes('exam') ||
        lower.includes('remind') ||
        lower.includes('schedule')
      ) {
        // Extract structured info in parallel
        try {
          const extracted = await api.extractTaskWithAI(text);
          if (extracted && extracted.title) {
            action = {
              type: 'create_task',
              payload: extracted,
              label: `Schedule "${extracted.title}" into Taskora`,
            };
          }
        } catch {
          // ignore extraction error
        }
      }

      const aiMsg: AIChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Super machi! I am right here. Tell me your plans in English or Tanglish.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text to Speech
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const promptChips = [
    'Naalaiku morning 7 maniku Java padikanum',
    'December 15 project submission. Remind 1 month & 1 week before',
    'Enaku innaiku task complete panna mudiyala',
    'March 15 2027 semester exam irukku. Plan advance reminders',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto px-2 sm:px-4 pb-20">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Taskora AI Companion
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Machi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-lingual: English • Tamil • Tanglish
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-600"
          title="Voice Speech Recognition"
        >
          <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden sm:inline">Voice Mode</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 pl-1">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 space-y-2 text-xs sm:text-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>

                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 pt-1">
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => speakMessage(m.text)}
                      className="hover:text-amber-300 transition-colors cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Suggested Action Card (Schedule Task / Reschedule) */}
                {m.suggestedAction && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                        Task Proposal Detected
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Action
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 font-semibold">
                      {m.suggestedAction.payload.title}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Deadline: {m.suggestedAction.payload.deadlineDate} @ {m.suggestedAction.payload.deadlineTime || '09:00'}
                    </div>

                    <button
                      onClick={() => onScheduleExtractedTask(m.suggestedAction?.payload)}
                      className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Add to Taskora</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-slate-800/80 px-3.5 py-2.5 rounded-2xl w-fit border border-slate-700">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Taskora AI is thinking in Tanglish...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="pt-2 pb-1 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Taskora in English or Tanglish (e.g. 'Naalaiku morning 7 AM Java...')"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
