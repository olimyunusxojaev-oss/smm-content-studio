'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ToneOfVoice, PostGoal } from '@/types/post';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface IdeaInputCardProps {
  idea: string;
  onIdeaChange: (idea: string) => void;
  tone: ToneOfVoice;
  onToneChange: (tone: ToneOfVoice) => void;
  goal: PostGoal;
  onGoalChange: (goal: PostGoal) => void;
  isGenerating: boolean;
}

const ideaPresets = [
  '🔥 Топ-3 фатальных ошибок новичков в нише',
  '💡 Разбор свежего кейса клиента с цифрами',
  '🎁 Специальное сезонное предложение с ограничением',
  '⚡ 5 мифов, которые стоят клиентам денег',
  '❓ Честный ответ на самый частый вопрос клиентов',
];

const toneOptions: { id: ToneOfVoice; label: string }[] = [
  { id: 'selling', label: 'Продающий' },
  { id: 'expert', label: 'Экспертный' },
  { id: 'friendly', label: 'Дружелюбный' },
  { id: 'provocative', label: 'Провокационный' },
  { id: 'concise', label: 'Лаконичный' },
];

const goalOptions: { id: PostGoal; label: string }[] = [
  { id: 'sales', label: 'Заявки / Продажи' },
  { id: 'engagement', label: 'Комментарии' },
  { id: 'authority', label: 'Экспертность' },
  { id: 'announcement', label: 'Анонс события' },
];

export const IdeaInputCard: React.FC<IdeaInputCardProps> = ({
  idea,
  onIdeaChange,
  tone,
  onToneChange,
  goal,
  onGoalChange,
  isGenerating,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handlePresetClick = (preset: string) => {
    sound.playClick();
    triggerHaptic('tap');
    onIdeaChange(preset);
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-squircle p-4 border border-surface-border dark:border-surface-borderDark shadow-soft-card dark:shadow-soft-card-dark transition-colors">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-ink-primary dark:text-ink-inverted flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand-bronze" />
          Идея или тема <span className="font-bold">поста</span>
        </label>
        
        <button
          onClick={() => {
            sound.playClick();
            triggerHaptic('tap');
            setShowOptions(!showOptions);
          }}
          className="text-[11px] font-medium text-brand-bronze flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <SlidersHorizontal size={12} />
          {showOptions ? 'Скрыть параметры' : 'Тон и цель'}
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="relative">
        <textarea
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          disabled={isGenerating}
          placeholder="О чем хотите рассказать? Например: Почему лазерная эпиляция на диодном аппарате безболезненна и когда виден первый результат..."
          rows={3}
          className="w-full p-3 rounded-2xl bg-canvas-light dark:bg-canvas-muted-dark border border-surface-border dark:border-surface-borderDark text-sm text-ink-primary dark:text-ink-inverted placeholder:text-ink-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand-bronze transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Quick idea chips */}
      <div className="mt-2.5">
        <span className="text-[10px] font-medium tracking-wide uppercase text-ink-secondary dark:text-ink-invertedMuted block mb-1.5">
          Идеи для быстрого старта:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ideaPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              disabled={isGenerating}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark text-ink-secondary dark:text-ink-invertedMuted border border-transparent hover:border-brand-bronze/40 active:scale-95 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Tone & Goal settings accordion */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="overflow-hidden pt-3 border-t border-surface-border dark:border-surface-borderDark mt-3"
          >
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted block mb-1.5">
                  Тональность текста (Tone of Voice):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {toneOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        sound.playClick();
                        triggerHaptic('tap');
                        onToneChange(opt.id);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        tone === opt.id
                          ? 'bg-ink-primary text-canvas-light dark:bg-canvas-light dark:text-ink-primary font-medium border-transparent shadow-sm'
                          : 'bg-canvas-muted dark:bg-canvas-muted-dark border-transparent text-ink-secondary dark:text-ink-invertedMuted hover:border-brand-bronze/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted block mb-1.5">
                  Главная цель поста:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        sound.playClick();
                        triggerHaptic('tap');
                        onGoalChange(opt.id);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        goal === opt.id
                          ? 'bg-ink-primary text-canvas-light dark:bg-canvas-light dark:text-ink-primary font-medium border-transparent shadow-sm'
                          : 'bg-canvas-muted dark:bg-canvas-muted-dark border-transparent text-ink-secondary dark:text-ink-invertedMuted hover:border-brand-bronze/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
