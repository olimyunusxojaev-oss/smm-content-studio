'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface HookMeterProps {
  score?: number; // 1, 2, or 3
}

export const HookMeter: React.FC<HookMeterProps> = ({ score = 3 }) => {
  const labels: Record<number, string> = {
    1: 'Базовый хук',
    2: 'Уверенный хук',
    3: 'Высокая виральность (3/3)',
  };

  return (
    <div className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 inline-flex">
      <Flame size={12} className="text-brand-bronze fill-brand-bronze" />
      <span className="text-[10px] font-semibold tracking-wide text-brand-bronzeDark dark:text-brand-bronze">
        {labels[score] || 'Виральный хук'}
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((level) => (
          <span
            key={level}
            className={`w-3.5 h-1 rounded-full transition-all duration-300 ${
              level <= score
                ? 'bg-brand-bronze shadow-[0_0_6px_rgba(197,168,128,0.8)]'
                : 'bg-canvas-muted dark:bg-canvas-muted-dark opacity-40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
