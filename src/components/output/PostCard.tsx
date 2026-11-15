'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, MessageCircle, Hash, ArrowUpRight } from 'lucide-react';
import { PostVariant } from '@/types/post';
import { HookMeter } from './HookMeter';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface PostCardProps {
  variant: PostVariant;
  isStreaming?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ variant, isStreaming }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      sound.playCopySuccess();
      triggerHaptic('success');
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Split body into paragraphs for line-by-line staggered fade-up
  const bodyParagraphs = variant.body ? variant.body.split('\n\n').filter(p => p.trim()) : [];

  return (
    <div
      className={`w-full bg-surface-light dark:bg-surface-dark rounded-squircle p-5 border border-surface-border dark:border-surface-borderDark shadow-soft-card dark:shadow-soft-card-dark transition-all duration-300 ${
        isStreaming ? 'animate-breathing-glow border-brand-bronze/40' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-borderDark mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-ink-primary text-canvas-light dark:bg-canvas-light dark:text-ink-primary text-[10px] font-bold uppercase tracking-wider">
            {variant.styleName}
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[11px] text-brand-bronze animate-pulse">
              <Sparkles size={12} />
              генерация...
            </span>
          )}
        </div>
        <HookMeter score={variant.hookScore || 3} />
      </div>

      {/* 1. HEADLINE BLOCK (Hook) */}
      <div className="group relative mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted">
            Заголовок / Hook
          </span>
          <button
            onClick={() => copyToClipboard(variant.headline, 'headline')}
            className="opacity-70 group-hover:opacity-100 hover:text-brand-bronze transition-opacity flex items-center gap-1 text-[11px] text-ink-secondary dark:text-ink-invertedMuted"
            title="Скопировать заголовок"
          >
            {copiedSection === 'headline' ? (
              <>
                <Check size={12} className="text-green-500" />
                <span className="text-green-500 font-medium">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Копировать</span>
              </>
            )}
          </button>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-base font-bold text-ink-primary dark:text-ink-inverted leading-snug"
        >
          {variant.headline || (
            <span className="inline-flex items-center gap-1 text-ink-secondary italic font-normal">
              Формируем цепляющий хук
              <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze animate-ping" />
            </span>
          )}
        </motion.h2>
      </div>

      {/* 2. BODY TEXT BLOCK */}
      <div className="group relative mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted">
            Основной текст
          </span>
          <button
            onClick={() => copyToClipboard(variant.body, 'body')}
            className="opacity-70 group-hover:opacity-100 hover:text-brand-bronze transition-opacity flex items-center gap-1 text-[11px] text-ink-secondary dark:text-ink-invertedMuted"
            title="Скопировать текст"
          >
            {copiedSection === 'body' ? (
              <>
                <Check size={12} className="text-green-500" />
                <span className="text-green-500 font-medium">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Копировать</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-2.5 text-[13.5px] text-ink-primary/95 dark:text-ink-inverted/95 leading-relaxed font-normal">
          {bodyParagraphs.length > 0 ? (
            bodyParagraphs.map((paragraph, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="whitespace-pre-line"
              >
                {paragraph}
              </motion.p>
            ))
          ) : (
            <div className="py-4 text-center text-ink-secondary italic text-xs">
              <span className="inline-block animate-pulse">Текст генерируется каскадным потоком...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. CTA BLOCK */}
      <div className="group relative mb-4 p-3.5 rounded-2xl bg-canvas-muted dark:bg-canvas-muted-dark border border-brand-bronze/20">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-bronzeDark dark:text-brand-bronze flex items-center gap-1">
            <ArrowUpRight size={12} />
            Призыв к действию (CTA)
          </span>
          <button
            onClick={() => copyToClipboard(variant.cta, 'cta')}
            className="hover:text-brand-bronze transition-colors flex items-center gap-1 text-[10px] text-ink-secondary dark:text-ink-invertedMuted"
          >
            {copiedSection === 'cta' ? (
              <>
                <Check size={11} className="text-green-500" />
                <span className="text-green-500 font-medium">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Копировать</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs font-semibold text-ink-primary dark:text-ink-inverted">
          👉 {variant.cta || 'Призыв к действию формируется...'}
        </p>
      </div>

      {/* 4. HASHTAGS BLOCK */}
      <div className="group relative pt-1 border-t border-surface-border dark:border-surface-borderDark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary dark:text-ink-invertedMuted flex items-center gap-1">
            <Hash size={11} />
            Хэштеги ({variant.hashtags?.length || 0})
          </span>
          <button
            onClick={() => copyToClipboard(variant.hashtags?.join(' ') || '', 'hashtags')}
            className="hover:text-brand-bronze transition-colors flex items-center gap-1 text-[10px] text-ink-secondary dark:text-ink-invertedMuted"
          >
            {copiedSection === 'hashtags' ? (
              <>
                <Check size={11} className="text-green-500" />
                <span className="text-green-500 font-medium">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Копировать все теги</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {variant.hashtags && variant.hashtags.length > 0 ? (
            variant.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark text-ink-secondary dark:text-ink-invertedMuted border border-surface-border dark:border-surface-borderDark font-medium"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))
          ) : (
            <span className="text-xs text-ink-secondary italic">Хэштеги загружаются...</span>
          )}
        </div>
      </div>
    </div>
  );
};
