'use client';

import React from 'react';
import { Moon, Sun, Volume2, VolumeX, Key, Clock } from 'lucide-react';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenHistory,
  historyCount,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-30 px-5 pt-4 pb-3 flex items-center justify-between glass-panel border-b border-surface-border dark:border-surface-borderDark transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-ink-primary text-canvas-light dark:bg-canvas-light dark:text-ink-primary flex items-center justify-center font-bold text-sm shadow-sm">
          ✦
        </div>
        <div>
          <span className="font-semibold tracking-tight text-base text-ink-primary dark:text-ink-inverted">
            Social<span className="text-brand-bronze font-normal">Studio</span>
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-brand-bronze/15 text-brand-bronzeDark dark:text-brand-bronze">
            3.8 Flash
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Sound toggle */}
        <button
          onClick={() => {
            sound.playClick();
            triggerHaptic('tap');
            onToggleSound();
          }}
          title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-secondary dark:text-ink-invertedMuted hover:bg-canvas-muted dark:hover:bg-canvas-muted-dark transition-colors"
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => {
            sound.playClick();
            triggerHaptic('tap');
            onToggleTheme();
          }}
          title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-secondary dark:text-ink-invertedMuted hover:bg-canvas-muted dark:hover:bg-canvas-muted-dark transition-colors"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* History drawer button */}
        <button
          onClick={() => {
            sound.playClick();
            triggerHaptic('tap');
            onOpenHistory();
          }}
          title="История постов"
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-ink-secondary dark:text-ink-invertedMuted hover:bg-canvas-muted dark:hover:bg-canvas-muted-dark transition-colors"
        >
          <Clock size={17} />
          {historyCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-bronze ring-2 ring-canvas-light dark:ring-canvas-dark" />
          )}
        </button>

        {/* BYOK Settings button */}
        <button
          onClick={() => {
            sound.playClick();
            triggerHaptic('tap');
            onOpenSettings();
          }}
          title="Настройки API Gemini"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            hasApiKey
              ? 'text-ink-secondary dark:text-ink-invertedMuted hover:bg-canvas-muted dark:hover:bg-canvas-muted-dark'
              : 'text-brand-bronze bg-brand-bronze/15 animate-pulse'
          }`}
        >
          <Key size={17} />
        </button>
      </div>
    </header>
  );
};
