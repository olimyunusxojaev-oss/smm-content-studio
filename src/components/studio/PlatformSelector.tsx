'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Instagram, Youtube } from 'lucide-react';
import { SocialPlatform } from '@/types/post';
import { sound } from '@/lib/utils/audio';
import { triggerHaptic } from '@/lib/utils/haptics';

interface PlatformSelectorProps {
  platform: SocialPlatform;
  onChange: (platform: SocialPlatform) => void;
}

const platforms: {
  id: SocialPlatform;
  label: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
}[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    icon: <Send size={14} className="fill-current rotate-[-15deg]" />,
    badgeBg: 'bg-[#24A1DE]',
    badgeText: 'text-white',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram size={14} />,
    badgeBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    badgeText: 'text-white',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: <Youtube size={14} className="fill-current" />,
    badgeBg: 'bg-[#FF0000]',
    badgeText: 'text-white',
  },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platform,
  onChange,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-medium tracking-wider uppercase text-ink-secondary dark:text-ink-invertedMuted">
          Целевая соцсеть
        </span>
      </div>

      <div className="relative p-1 rounded-pill bg-canvas-muted dark:bg-canvas-muted-dark flex items-center gap-1 border border-surface-border dark:border-surface-borderDark">
        {platforms.map((item) => {
          const isActive = platform === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                triggerHaptic('tap');
                onChange(item.id);
              }}
              className="relative flex-1 py-2 px-2.5 rounded-pill flex items-center justify-center gap-1.5 z-10 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="platformActiveIndicator"
                  className="absolute inset-0 bg-white dark:bg-[#201D1A] rounded-pill shadow-sm border border-surface-border dark:border-surface-borderDark"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              
              <span
                className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-sm ${item.badgeBg} ${item.badgeText}`}
              >
                {item.icon}
              </span>

              <span
                className={`relative z-10 text-xs font-semibold tracking-tight transition-colors ${
                  isActive
                    ? 'text-ink-primary dark:text-ink-inverted font-bold'
                    : 'text-ink-secondary dark:text-ink-invertedMuted'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
