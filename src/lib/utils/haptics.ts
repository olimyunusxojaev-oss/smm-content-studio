/**
 * Tactile Haptic Vibration for Mobile Devices
 */
export const triggerHaptic = (type: 'tap' | 'success' | 'warning' | 'error' = 'tap') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(15);
        break;
      case 'success':
        navigator.vibrate([25, 40, 30]);
        break;
      case 'warning':
        navigator.vibrate([40, 60, 40]);
        break;
      case 'error':
        navigator.vibrate([60, 80, 80]);
        break;
    }
  } catch {
    // Ignore unsupported browser environments
  }
};
