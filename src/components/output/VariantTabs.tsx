'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PostVariant } from '@/types/post';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface VariantTabsProps {
  variants: PostVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  isStreaming?: boolean;
}

export const VariantTabs: React.FC<VariantTabsProps> = ({
  variants,
  selectedIndex,
  onSelect,
  isStreaming,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-medium tracking-wider uppercase text-ink-secondary dark:text-ink-invertedMuted">
          Варианты постов на выбор (3)
        </span>
        <span className="text-[11px] font-semibold text-brand-bronze">
          {selectedIndex + 1} из {Math.max(variants.length, 3)}
        </span>
      </div>

      <div className="relative p-1 rounded-pill bg-canvas-muted dark:bg-canvas-muted-dark flex items-center gap-1 border border-surface-border dark:border-surface-borderDark">
        {variants.map((v, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={v.id || idx}
              onClick={() => {
                sound.playClick();
                triggerHaptic('tap');
                onSelect(idx);
              }}
              className="relative flex-1 py-1.5 px-2 rounded-pill flex items-center justify-center gap-1 z-10 transition-colors"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeVariantTab"
                  className="absolute inset-0 bg-white dark:bg-[#201D1A] rounded-pill shadow-sm border border-surface-border dark:border-surface-borderDark"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}

              <span
                className={`relative z-10 text-[11px] font-medium tracking-tight truncate transition-colors ${
                  isSelected
                    ? 'text-ink-primary dark:text-ink-inverted font-bold'
                    : 'text-ink-secondary dark:text-ink-invertedMuted'
                }`}
              >
                {v.styleName || `Вариант ${idx + 1}`}
              </span>

              {isStreaming && idx === selectedIndex && (
                <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-brand-bronze animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
