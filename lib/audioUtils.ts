/**
 * Audio utility to generate and play notification sounds
 * Fallback when bell.mp3 is not available
 */

import { getAudioContext, initAudioContext } from './audioContext';

export async function playNotificationSound(): Promise<void> {
  console.log('playNotificationSound called');
  
  // Get or initialize AudioContext (already unlocked by user clicking Start button)
  let audioContext = getAudioContext();
  
  if (!audioContext) {
    console.log('No audio context found, initializing...');
    initAudioContext();
    audioContext = getAudioContext();
  }
  
  if (!audioContext) {
    console.error('Failed to create AudioContext');
    return;
  }
  
  console.log('AudioContext state:', audioContext.state);
  
  // Resume if suspended
  if (audioContext.state === 'suspended') {
    console.log('Resuming suspended AudioContext...');
    await audioContext.resume();
    console.log('AudioContext resumed, state:', audioContext.state);
  }
  
  // Try to load and play bell.mp3 using AudioContext
  try {
    console.log('Fetching bell.mp3...');
    const response = await fetch('/sounds/bell.mp3');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Decoding audio data...');
    const arrayBuffer = await response.arrayBuffer();
    console.log('ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    console.log('Audio buffer decoded - Duration:', audioBuffer.duration, 'seconds, Channels:', audioBuffer.numberOfChannels, 'Sample rate:', audioBuffer.sampleRate);
    
    console.log('Creating audio source...');
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = 1.0; // Full volume
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    console.log('Starting playback now...');
    source.start(0);
    console.log('Playing bell.mp3 successfully! 🔔 Duration:', audioBuffer.duration, 's');
    
  } catch (err) {
    console.warn('Could not play bell.mp3, using generated sound:', err);
    playGeneratedBell(audioContext);
  }
}

function playGeneratedBell(audioContext: AudioContext): void {
  console.log('playGeneratedBell called, context state:', audioContext.state);
  
  try {
    // Create a bell-like sound with multiple frequencies
    const createTone = (frequency: number, startTime: number, duration: number, volume: number) => {
      console.log(`Creating tone: ${frequency}Hz, volume: ${volume}`);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Envelope: quick attack, slow decay
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    console.log('Current audio time:', now);
    
    // Bell harmonics (multiple frequencies create a richer sound)
    createTone(800, now, 0.8, 0.3);  // Fundamental
    createTone(1200, now, 0.6, 0.15); // Second harmonic
    createTone(1600, now, 0.4, 0.1);  // Third harmonic
    
    console.log('Generated bell sound tones created');
  } catch (err) {
    console.error('Error in playGeneratedBell:', err);
  }
}
