/**
 * Global audio context manager
 * Ensures AudioContext is created and resumed with user interaction
 */

let globalAudioContext: AudioContext | null = null;

export function initAudioContext(): void {
  if (typeof window === 'undefined') return;
  
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!globalAudioContext) {
    globalAudioContext = new AudioContextClass();
    console.log('AudioContext created');
  }

  // Resume if suspended
  if (globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().then(() => {
      console.log('AudioContext resumed');
    }).catch((err) => {
      console.warn('Failed to resume AudioContext:', err);
    });
  }
}

export function getAudioContext(): AudioContext | null {
  return globalAudioContext;
}
