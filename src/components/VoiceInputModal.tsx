import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import { Task } from '../types';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTask: (taskData: Partial<Task>) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onConfirmTask,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTask, setExtractedTask] = useState<Partial<Task> | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US'; // Also captures Indian English and Tanglish phonetics well

        recog.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not natively supported in this browser. You can type your natural sentence below!');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setExtractedTask(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const handleProcessTranscript = async (textToProcess?: string) => {
    const input = textToProcess || transcript;
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      const result = await api.extractTaskWithAI(input);
      setExtractedTask(result);
    } catch (err) {
      console.error('Error processing transcript with AI:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (extractedTask) {
      onConfirmTask(extractedTask);
      onClose();
    }
  };

  // Sample quick voice prompts (English & Tanglish)
  const quickSamples = [
    'March 15 2027 enakku exam irukku. One month munnadi remind pannu.',
    'Naalaiku morning 7 maniku Java study task create pannu with 30 min reminder.',
    'December 15 project submission deadline. Remind me 1 month and 1 week before.',
    'Schedule Gym workout today at 6 PM with 1 hour advance reminder.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Voice & Natural Language Add</h3>
              <p className="text-xs text-slate-400">Supports English, Tamil & Tanglish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Activation Area */}
        <div className="my-6 flex flex-col items-center justify-center text-center">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50 scale-110'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <span className="text-xs font-medium text-slate-300 mt-3">
            {isListening ? 'Listening... Speak in English or Tanglish' : 'Tap to start speaking'}
          </span>
        </div>

        {/* Transcript / Input Box */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Or type/paste your instruction here (e.g., 'March 15 2027 enakku exam irukku. One month munnadi remind pannu')..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder-slate-500"
            />
          </div>

          {/* Quick Examples */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Try saying or clicking:
            </span>
            <div className="flex flex-col gap-1.5">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscript(sample);
                    handleProcessTranscript(sample);
                  }}
                  className="text-left text-xs text-indigo-300 hover:text-indigo-200 bg-slate-800/40 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {/* Process with AI Button */}
          {!extractedTask && (
            <button
              onClick={() => handleProcessTranscript()}
              disabled={!transcript.trim() || isProcessing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Extracting Details...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Extract Structured Task</span>
                </>
              )}
            </button>
          )}

          {/* Extracted Details Confirmation Card */}
          {extractedTask && (
            <div className="bg-slate-800/80 border border-indigo-500/40 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AI Extracted Confirmation
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Ready to schedule
                </span>
              </div>

              <div className="text-sm font-bold text-white">{extractedTask.title}</div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deadline: {extractedTask.deadlineDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time: {extractedTask.deadlineTime || '09:00'}</span>
                </div>
              </div>

              {extractedTask.reminders && extractedTask.reminders.length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                  <Bell className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Reminders: {extractedTask.reminders.join(', ')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setExtractedTask(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Edit / Retry
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Confirm & Save Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
