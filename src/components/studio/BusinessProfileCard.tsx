'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Briefcase, Check } from 'lucide-react';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface BusinessProfileCardProps {
  value: string;
  onChange: (value: string) => void;
}

const businessPresets = [
  'Эстетическая косметология и лазер',
  'IT / SaaS стартап и автоматизация',
  'Онлайн-школа и курсы профессий',
  'Спешелти кофейня и пекарня',
  'Экспертный блог и консалтинг',
];

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    sound.playClick();
    triggerHaptic('tap');
    setIsOpen(!isOpen);
  };

  const handleSelectPreset = (preset: string) => {
    sound.playClick();
    triggerHaptic('tap');
    onChange(preset);
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark rounded-squircle p-4 border border-surface-border dark:border-surface-borderDark shadow-soft-card dark:shadow-soft-card-dark transition-colors">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark flex items-center justify-center text-brand-bronze dark:text-brand-bronzeLight">
            <Briefcase size={15} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-primary dark:text-ink-inverted">
              О вашем <span className="font-bold">Бизнесе</span>
            </h3>
            <p className="text-[11px] text-ink-secondary dark:text-ink-invertedMuted truncate max-w-[220px]">
              {value ? value : 'Задайте нишу для точных постов'}
            </p>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark flex items-center justify-center text-ink-primary dark:text-ink-inverted transition-transform">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="overflow-hidden pt-3.5"
          >
            <div className="border-t border-surface-border dark:border-surface-borderDark pt-3">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted mb-1.5">
                Краткое описание бизнеса или УТП
              </label>

              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Например: Сеть клиник лазерной эпиляции в Варшаве и Киеве. Премиум аппараты, безболезненно, врачи с опытом от 5 лет..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-canvas-light dark:bg-canvas-muted-dark border border-surface-border dark:border-surface-borderDark text-xs text-ink-primary dark:text-ink-inverted placeholder:text-ink-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand-bronze transition-all resize-none"
              />

              <div className="mt-2.5">
                <span className="text-[10px] text-ink-secondary dark:text-ink-invertedMuted block mb-1.5">
                  Быстрые шаблоны ниш:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {businessPresets.map((preset) => {
                    const isSelected = value === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-brand-bronze/20 border-brand-bronze text-ink-primary dark:text-ink-inverted font-medium'
                            : 'bg-canvas-muted dark:bg-canvas-muted-dark border-transparent text-ink-secondary dark:text-ink-invertedMuted hover:border-brand-bronze/40'
                        }`}
                      >
                        {isSelected && <Check size={10} className="text-brand-bronze" />}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
