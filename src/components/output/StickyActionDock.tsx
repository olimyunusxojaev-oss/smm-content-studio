'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCw, Check, Sparkles, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface StickyActionDockProps {
  hasResult: boolean;
  isStreaming: boolean;
  onGenerate: () => void;
  onCopyFullPost: () => void;
  onRegenerate: () => void;
  canGenerate: boolean;
}

export const StickyActionDock: React.FC<StickyActionDockProps> = ({
  hasResult,
  isStreaming,
  onGenerate,
  onCopyFullPost,
  onRegenerate,
  canGenerate,
}) => {
  const [copiedRecently, setCopiedRecently] = useState(false);

  const handleCopy = () => {
    sound.playCopySuccess();
    triggerHaptic('success');

    // Trigger subtle confetti celebration
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.88 },
        colors: ['#C5A880', '#181615', '#FAF8F5'],
      });
    } catch {
      // Ignored if canvas unsupported
    }

    setCopiedRecently(true);
    onCopyFullPost();
    setTimeout(() => setCopiedRecently(false), 2400);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto px-4 pb-4 pt-2.5 bg-gradient-to-t from-canvas-light via-canvas-light/95 to-transparent dark:from-canvas-dark dark:via-canvas-dark/95">
      <div className="flex items-center gap-2">
        {hasResult && !isStreaming ? (
          <>
            {/* Secondary: Regenerate Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                sound.playClick();
                triggerHaptic('tap');
                onRegenerate();
              }}
              title="Перегенерировать варианты"
              className="h-12 w-12 rounded-full bg-surface-light dark:bg-surface-dark border border-surface-border dark:border-surface-borderDark flex items-center justify-center text-ink-primary dark:text-ink-inverted shadow-soft-card active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCw size={17} />
            </motion.button>

            {/* Primary: 1-Click Copy Full Post */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleCopy}
              className={`flex-1 h-12 px-5 rounded-full flex items-center justify-between text-xs font-semibold shadow-lg transition-all duration-300 ${
                copiedRecently
                  ? 'bg-green-700 text-white shadow-green-900/20'
                  : 'bg-brand-darkButton text-canvas-light dark:bg-canvas-light dark:text-ink-primary shadow-black/15'
              }`}
            >
              <span className="flex items-center gap-2">
                {copiedRecently ? <Check size={16} /> : <Copy size={16} />}
                <span>
                  {copiedRecently ? 'Полный пост скопирован! ✓' : 'Скопировать весь пост (1 клик)'}
                </span>
              </span>

              <span className="w-7 h-7 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                {copiedRecently ? <Check size={14} /> : <ArrowRight size={14} />}
              </span>
            </motion.button>
          </>
        ) : (
          /* Primary: Generate Button */
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (canGenerate && !isStreaming) {
                sound.playGenerationStart();
                triggerHaptic('tap');
                onGenerate();
              }
            }}
            disabled={!canGenerate || isStreaming}
            className={`w-full h-13 py-3 px-5 rounded-full flex items-center justify-between text-xs font-semibold shadow-lg transition-all ${
              canGenerate && !isStreaming
                ? 'bg-brand-darkButton text-canvas-light dark:bg-canvas-light dark:text-ink-primary shadow-black/20 hover:opacity-95'
                : 'bg-canvas-muted dark:bg-canvas-muted-dark text-ink-secondary/60 cursor-not-allowed border border-surface-border'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {isStreaming ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-brand-bronze animate-ping" />
                  <span>Создаем 3 варианта...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-brand-bronze" />
                  <span>Сгенерировать 3 варианта</span>
                </>
              )}
            </span>

            <span className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
              <ArrowRight size={15} />
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
