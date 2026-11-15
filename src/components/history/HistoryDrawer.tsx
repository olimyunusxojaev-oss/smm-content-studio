'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Star, Trash2, Copy, Check, Clock, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { HistoryItem, SocialPlatform } from '@/types/post';
import { formatFullPost } from '@/lib/utils/formatters';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPost,
}) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const records = await db.history.orderBy('createdAt').reverse().toArray();
      setItems(records);
    } catch {
      // IndexedDB fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const toggleFavorite = async (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    sound.playClick();
    triggerHaptic('tap');
    const updated = !item.isFavorite;
    await db.history.update(item.id, { isFavorite: updated });
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isFavorite: updated } : i))
    );
  };

  const deleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playClick();
    triggerHaptic('warning');
    await db.history.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCopyPost = async (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    const variant = item.variants[item.selectedVariantIndex || 0] || item.variants[0];
    if (!variant) return;

    const fullText = formatFullPost(variant);
    await navigator.clipboard.writeText(fullText);
    sound.playCopySuccess();
    triggerHaptic('success');
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter((item) => {
    if (filterPlatform === 'favorite' && !item.isFavorite) return false;
    if (filterPlatform !== 'all' && filterPlatform !== 'favorite' && item.platform !== filterPlatform) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTopic = item.topic.toLowerCase().includes(q);
      const inVariants = item.variants.some(
        (v) => v.headline.toLowerCase().includes(q) || v.body.toLowerCase().includes(q)
      );
      return inTopic || inVariants;
    }
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="relative w-full max-w-[480px] bg-canvas-light dark:bg-canvas-dark rounded-t-[32px] max-h-[85vh] flex flex-col shadow-2xl border-t border-surface-border dark:border-surface-borderDark overflow-hidden z-10"
          >
            {/* Grab handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <span className="w-10 h-1.5 rounded-full bg-ink-secondary/20 dark:bg-ink-invertedMuted/20" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-surface-border dark:border-surface-borderDark">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-brand-bronze" />
                <h2 className="text-base font-bold text-ink-primary dark:text-ink-inverted">
                  История <span className="font-normal">генераций</span>
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-bronze/15 text-brand-bronzeDark dark:text-brand-bronze font-semibold">
                  {items.length}
                </span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-canvas-muted dark:bg-canvas-muted-dark flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="p-4 space-y-2.5 border-b border-surface-border dark:border-surface-borderDark">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по теме или тексту..."
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-surface-light dark:bg-surface-dark border border-surface-border dark:border-surface-borderDark text-xs text-ink-primary dark:text-ink-inverted placeholder:text-ink-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand-bronze"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'favorite', label: '★ Избранное' },
                  { id: 'telegram', label: 'Telegram' },
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'youtube', label: 'YouTube' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      sound.playClick();
                      triggerHaptic('tap');
                      setFilterPlatform(chip.id);
                    }}
                    className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                      filterPlatform === chip.id
                        ? 'bg-ink-primary text-canvas-light dark:bg-canvas-light dark:text-ink-primary font-semibold shadow-sm'
                        : 'bg-canvas-muted dark:bg-canvas-muted-dark text-ink-secondary dark:text-ink-invertedMuted hover:border-brand-bronze/30'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-ink-secondary dark:text-ink-invertedMuted">
                  <p className="text-sm font-medium">Постов пока нет</p>
                  <p className="text-xs mt-1 opacity-70">Сгенерируйте свой первый пост в студии</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const currentVariant = item.variants[item.selectedVariantIndex || 0] || item.variants[0];
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        triggerHaptic('tap');
                        onSelectPost(item);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-surface-border dark:border-surface-borderDark hover:border-brand-bronze/40 cursor-pointer shadow-soft-card dark:shadow-soft-card-dark transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-bronze/15 text-brand-bronzeDark dark:text-brand-bronze">
                            {item.platform}
                          </span>
                          <span className="text-[10px] text-ink-secondary">
                            {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => toggleFavorite(e, item)}
                            className="p-1 text-ink-secondary hover:text-amber-500 transition-colors"
                            title="В избранное"
                          >
                            <Star
                              size={14}
                              className={item.isFavorite ? 'fill-amber-500 text-amber-500' : ''}
                            />
                          </button>

                          <button
                            onClick={(e) => handleCopyPost(e, item)}
                            className="p-1 text-ink-secondary hover:text-brand-bronze transition-colors"
                            title="Скопировать весь пост"
                          >
                            {copiedId === item.id ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                          <button
                            onClick={(e) => deleteItem(e, item.id)}
                            className="p-1 text-ink-secondary hover:text-red-500 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-ink-primary dark:text-ink-inverted line-clamp-1 mb-1">
                        {currentVariant?.headline || item.topic}
                      </h4>
                      <p className="text-[11px] text-ink-secondary dark:text-ink-invertedMuted line-clamp-2 leading-relaxed">
                        {currentVariant?.body}
                      </p>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
