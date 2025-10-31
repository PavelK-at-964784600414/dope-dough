/**
 * Audio utility to generate and play notification sounds
 * Fallback when bell.mp3 is not available
 * Includes rate limiting for security
 */

import { getAudioContext, initAudioContext } from './audioContext';
import { notificationRateLimiter } from './security';

export async function playNotificationSound(): Promise<void> {
  console.log('playNotificationSound called');
  
  // Rate limit notification sounds to prevent abuse
  if (!notificationRateLimiter.isAllowed('audio-notification')) {
    console.warn('[Security] Notification sound rate limit exceeded');
    return;
  }
  
  // Method 1: Try simple HTML5 Audio first (most reliable)
  try {
    console.log('Trying HTML5 Audio...');
    const audio = new Audio('/sounds/bell.mp3');
    audio.volume = 1.0;
    
    // Play the audio
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      await playPromise;
      console.log('✅ Bell played successfully using HTML5 Audio! 🔔');
      return; // Success! Exit function
    }
  } catch (htmlAudioErr) {
    console.warn('HTML5 Audio failed:', htmlAudioErr);
  }
  
  // Method 2: Fallback to AudioContext (for better compatibility)
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
    console.log('Fetching bell.mp3 for AudioContext...');
    const response = await fetch('/sounds/bell.mp3');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Decoding audio data...');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    console.log('Creating audio source...');
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = 1.0; // Full volume
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    console.log('Starting AudioContext playback...');
    source.start(0);
    console.log('✅ Playing bell.mp3 via AudioContext! 🔔');
    
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
