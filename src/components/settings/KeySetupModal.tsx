'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { testGeminiApiKey } from '@/lib/gemini/client';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface KeySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string, model: string) => void;
  currentModel: string;
}

const availableModels = [
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Рекомендуется, быстрый и умный)' },
  { id: 'gemini-1.5-flash-lite', label: 'Gemini 1.5 Flash Lite (Сверхлегкий)' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
];

export const KeySetupModal: React.FC<KeySetupModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  currentModel,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState(currentModel || 'gemini-2.0-flash');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);

  const handleTestKey = async () => {
    if (!inputKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    sound.playClick();

    const res = await testGeminiApiKey(inputKey.trim(), selectedModel);
    setIsTesting(false);
    setTestResult(res);

    if (res.valid) {
      sound.playCopySuccess();
      triggerHaptic('success');
    } else {
      triggerHaptic('error');
    }
  };

  const handleSave = () => {
    sound.playCopySuccess();
    triggerHaptic('success');
    onSaveKey(inputKey.trim(), selectedModel);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-[420px] bg-canvas-light dark:bg-canvas-dark rounded-[28px] p-5 shadow-2xl border border-surface-border dark:border-surface-borderDark z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-borderDark mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-bronze/15 text-brand-bronze flex items-center justify-center">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-primary dark:text-ink-inverted">
                    Ключ Gemini API <span className="font-normal">(BYOK)</span>
                  </h3>
                  <p className="text-[10px] text-ink-secondary">Безопасное локальное хранение в браузере</p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-7 h-7 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Input Form */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted mb-1.5">
                  Ваш API Ключ (Google AI Studio)
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="AIzaSy..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-border dark:border-surface-borderDark text-xs font-mono text-ink-primary dark:text-ink-inverted placeholder:text-ink-secondary/50 focus:outline-none focus:ring-1 focus:ring-brand-bronze"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary"
                  >
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted mb-1.5">
                  Модель Gemini
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-border dark:border-surface-borderDark text-xs text-ink-primary dark:text-ink-inverted focus:outline-none focus:ring-1 focus:ring-brand-bronze"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test status banner */}
              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    testResult.valid
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                  }`}
                >
                  {testResult.valid ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span className="text-[11px] leading-tight">{testResult.message}</span>
                </div>
              )}

              {/* Security info & Get Key link */}
              <div className="pt-2 text-[11px] text-ink-secondary dark:text-ink-invertedMuted space-y-1.5">
                <div className="flex items-center gap-1.5 text-ink-primary dark:text-ink-inverted font-medium">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Ключ хранится только в памяти вашего браузера</span>
                </div>
                <p className="leading-relaxed">
                  Мы не отправляем ваш ключ на сторонние серверы. Он используется напрямую для общения с Google Gemini API.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-bronze hover:underline font-semibold pt-1"
                >
                  <span>Получить бесплатный ключ в Google AI Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !inputKey.trim()}
                className="flex-1 py-2.5 px-3 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark text-xs font-semibold text-ink-primary dark:text-ink-inverted hover:bg-canvas-muted/80 transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Проверка...' : 'Проверить ключ'}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!inputKey.trim()}
                className="flex-1 py-2.5 px-3 rounded-full bg-brand-darkButton text-canvas-light dark:bg-canvas-light dark:text-ink-primary text-xs font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
