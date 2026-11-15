'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Key, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PlatformSelector } from '@/components/studio/PlatformSelector';
import { BusinessProfileCard } from '@/components/studio/BusinessProfileCard';
import { IdeaInputCard } from '@/components/studio/IdeaInputCard';
import { VariantTabs } from '@/components/output/VariantTabs';
import { PostCard } from '@/components/output/PostCard';
import { StickyActionDock } from '@/components/output/StickyActionDock';
import { HistoryDrawer } from '@/components/history/HistoryDrawer';
import { KeySetupModal } from '@/components/settings/KeySetupModal';
import { SocialPlatform, ToneOfVoice, PostGoal, PostVariant, HistoryItem } from '@/types/post';
import { streamPostGeneration } from '@/lib/gemini/client';
import { formatFullPost } from '@/lib/utils/formatters';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';
import { db } from '@/lib/db';

export default function StudioPage() {
  // Application Settings
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // Content Input State
  const [platform, setPlatform] = useState<SocialPlatform>('telegram');
  const [businessProfile, setBusinessProfile] = useState('');
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>('selling');
  const [goal, setGoal] = useState<PostGoal>('sales');

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<PostVariant[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize from LocalStorage and DB on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('smm_gemini_api_key') || '';
      const savedModel = localStorage.getItem('smm_gemini_model') || 'gemini-2.0-flash';
      const savedProfile = localStorage.getItem('smm_business_profile') || '';
      const savedTheme = (localStorage.getItem('smm_theme') as 'light' | 'dark') || 'light';
      const savedSound = localStorage.getItem('smm_sound') !== 'false';

      setApiKey(savedKey);
      setModel(savedModel);
      setBusinessProfile(savedProfile);
      setTheme(savedTheme);
      setSoundEnabled(savedSound);
      sound.setEnabled(savedSound);

      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Check history count
      db.history.count().then(setHistoryCount).catch(() => {});
    }
  }, []);

  // Theme switcher handler
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('smm_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    localStorage.setItem('smm_sound', String(next));
  };

  // Business Profile save
  const handleBusinessProfileChange = (value: string) => {
    setBusinessProfile(value);
    localStorage.setItem('smm_business_profile', value);
  };

  // Save API Key & Model
  const handleSaveKey = (key: string, selectedModel: string) => {
    setApiKey(key);
    setModel(selectedModel);
    localStorage.setItem('smm_gemini_api_key', key);
    localStorage.setItem('smm_gemini_model', selectedModel);
  };

  // Generate Handler
  const handleGenerate = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    if (!idea.trim()) return;

    setErrorMessage(null);
    setIsGenerating(true);
    setVariants([]);
    setSelectedIndex(0);

    abortControllerRef.current = new AbortController();

    await streamPostGeneration(
      {
        businessDescription: businessProfile,
        postIdea: idea,
        platform,
        tone,
        goal,
      },
      apiKey,
      model,
      {
        onChunk: (_, partials) => {
          if (partials.length > 0) {
            setVariants(
              partials.map((p, idx) => ({
                id: `v${idx + 1}`,
                styleName: p.styleName || `Вариант ${idx + 1}`,
                headline: p.headline || '',
                body: p.body || '',
                cta: p.cta || '',
                hashtags: p.hashtags || [],
                hookScore: idx === 0 ? 3 : idx === 1 ? 3 : 2,
              }))
            );
          }
        },
        onComplete: async (finalVariants) => {
          setVariants(finalVariants);
          setIsGenerating(false);
          sound.playCopySuccess();
          triggerHaptic('success');

          // Save to IndexedDB history
          try {
            const historyEntry: HistoryItem = {
              id: Date.now().toString(),
              createdAt: Date.now(),
              platform,
              topic: idea,
              businessDescription: businessProfile,
              variants: finalVariants,
              selectedVariantIndex: 0,
              isFavorite: false,
            };
            await db.history.add(historyEntry);
            const count = await db.history.count();
            setHistoryCount(count);
          } catch (e) {
            console.warn('History save error', e);
          }
        },
        onError: (err) => {
          setIsGenerating(false);
          setErrorMessage(err.message || 'Ошибка генерации постов');
          triggerHaptic('error');
        },
      },
      abortControllerRef.current.signal
    );
  };

  // Copy Full Post Handler
  const handleCopyFullPost = async () => {
    const currentVariant = variants[selectedIndex];
    if (!currentVariant) return;

    const fullFormattedText = formatFullPost(currentVariant);
    try {
      await navigator.clipboard.writeText(fullFormattedText);
    } catch {
      // Ignored
    }
  };

  // Select Post from History
  const handleSelectFromHistory = (item: HistoryItem) => {
    setPlatform(item.platform);
    setIdea(item.topic);
    if (item.businessDescription) {
      setBusinessProfile(item.businessDescription);
    }
    setVariants(item.variants);
    setSelectedIndex(item.selectedVariantIndex || 0);
  };

  const activeVariant = variants[selectedIndex] || variants[0];
  const canGenerate = Boolean(idea.trim());

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyCount}
        hasApiKey={Boolean(apiKey)}
      />

      <div className="flex-1 px-4 pt-4 pb-6 space-y-4">
        {/* Missing API Key Alert Banner */}
        {!apiKey && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200"
          >
            <div className="flex items-center gap-2">
              <Key size={16} className="text-amber-600 flex-shrink-0" />
              <span>Укажите ваш Gemini API ключ для начала работы</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-full bg-amber-600 text-white text-[11px] font-semibold flex-shrink-0 shadow-sm"
            >
              Ввести ключ
            </button>
          </motion.div>
        )}

        {/* Hero Section */}
        <section className="pt-1 pb-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-brand-bronzeDark dark:text-brand-bronze mb-1">
            Контент-генератор нового поколения
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-ink-inverted leading-tight">
            Создавайте <span className="text-brand-bronze font-extrabold">виральный контент</span>
          </h1>
          <p className="text-xs text-ink-secondary dark:text-ink-invertedMuted mt-1">
            Готовые посты для соцсетей за 10 секунд на базе Gemini Flash
          </p>
        </section>

        {/* 1. Platform Selector */}
        <PlatformSelector platform={platform} onChange={setPlatform} />

        {/* 2. Business Profile Accordion Card */}
        <BusinessProfileCard
          value={businessProfile}
          onChange={handleBusinessProfileChange}
        />

        {/* 3. Idea Input & Tone Selection Card */}
        <IdeaInputCard
          idea={idea}
          onIdeaChange={setIdea}
          tone={tone}
          onToneChange={setTone}
          goal={goal}
          onGoalChange={setGoal}
          isGenerating={isGenerating}
        />

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Ошибка</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Generation Results Section */}
        {(variants.length > 0 || isGenerating) && (
          <section className="space-y-3 pt-2">
            {/* 3-Variant Tabs */}
            <VariantTabs
              variants={variants}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              isStreaming={isGenerating}
            />

            {/* Active Post Card */}
            {activeVariant && (
              <PostCard variant={activeVariant} isStreaming={isGenerating} />
            )}
          </section>
        )}
      </div>

      {/* Floating Thumb Sticky Action Dock */}
      <StickyActionDock
        hasResult={variants.length > 0}
        isStreaming={isGenerating}
        onGenerate={handleGenerate}
        onCopyFullPost={handleCopyFullPost}
        onRegenerate={handleGenerate}
        canGenerate={canGenerate}
      />

      {/* Drawers & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPost={handleSelectFromHistory}
      />

      <KeySetupModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
        currentModel={model}
      />
    </div>
  );
}
