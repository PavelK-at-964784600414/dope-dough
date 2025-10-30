/**
 * Calendar utilities for creating device-native calendar events
 * Supports iPhone, Android, Windows, macOS via iCalendar format
 */

interface CalendarEvent {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

/**
 * Format a date for iCalendar format (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate an iCalendar (.ics) file content
 */
function generateICS(event: CalendarEvent): string {
  const startTime = formatICalDate(event.startTime);
  const endTime = formatICalDate(event.endTime);
  const timestamp = formatICalDate(new Date());
  
  // Generate a unique ID for the event
  const uid = `${timestamp}-${Math.random().toString(36).substring(7)}@dope-dough.app`;
  
  // Escape special characters in text fields
  const escapeText = (text: string) => text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
  
  const title = escapeText(event.title);
  const description = event.description ? escapeText(event.description) : '';
  const location = event.location ? escapeText(event.location) : '';
  
  // Create iCalendar content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//La Petite Sourdough//Sourdough Timer//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : '',
    location ? `LOCATION:${location}` : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT0M', // Alert at the event time (0 minutes before)
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line !== '').join('\r\n');
  
  return icsContent;
}

/**
 * Open calendar event using URL schemes (no download)
 * Uses platform-specific calendar URLs
 */
function openCalendarEvent(event: CalendarEvent, filename: string) {
  const startTime = event.startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endTime = event.endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  // Detect platform
  const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isAndroid) {
    // Android: Use Google Calendar intent
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', event.title);
    googleUrl.searchParams.set('dates', `${startTime}/${endTime}`);
    googleUrl.searchParams.set('details', event.description || '');
    googleUrl.searchParams.set('location', event.location || '');
    
    window.open(googleUrl.toString(), '_blank');
  } else if (isApple) {
    // iOS/macOS: Create data URL that iOS will open in Calendar app
    const icsContent = generateICS(event);
    const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
    
    // iOS Safari will open this in Calendar app
    window.location.href = dataUrl;
  } else {
    // Desktop fallback: Google Calendar web
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', event.title);
    googleUrl.searchParams.set('dates', `${startTime}/${endTime}`);
    googleUrl.searchParams.set('details', event.description || '');
    googleUrl.searchParams.set('location', event.location || '');
    
    window.open(googleUrl.toString(), '_blank');
  }
}

/**
 * Create a calendar event for a recipe step timer
 */
export function createTimerCalendarEvent(
  stepTitle: string,
  stepNumber: number,
  durationSeconds: number,
  language: 'en' | 'ru' = 'en'
): void {
  const now = new Date();
  const endTime = new Date(now.getTime() + durationSeconds * 1000);
  
  // Add a small buffer to the event end time
  const eventEndTime = new Date(endTime.getTime() + 5 * 60 * 1000); // 5 minutes after
  
  const translations = {
    en: {
      title: `🍞 Sourdough: ${stepTitle}`,
      description: `Your sourdough recipe timer for Step ${stepNumber} (${stepTitle}) will complete at this time. Check your dough and proceed to the next step!`,
      location: 'La Petite Sourdough App',
      filename: `sourdough-step-${stepNumber}.ics`
    },
    ru: {
      title: `🍞 Закваска: ${stepTitle}`,
      description: `Таймер рецепта на закваске для Шага ${stepNumber} (${stepTitle}) завершится в это время. Проверьте тесто и переходите к следующему шагу!`,
      location: 'Приложение La Petite Sourdough',
      filename: `zakvaska-shag-${stepNumber}.ics`
    }
  };
  
  const t = translations[language];
  
  const event: CalendarEvent = {
    title: t.title,
    description: t.description,
    startTime: endTime,
    endTime: eventEndTime,
    location: t.location
  };
  
  openCalendarEvent(event, t.filename);
}

/**
 * Create a calendar event for feeding the starter
 */
export function createFeedingCalendarEvent(
  feedingTime: Date,
  language: 'en' | 'ru' = 'en'
): void {
  const eventEndTime = new Date(feedingTime.getTime() + 30 * 60 * 1000); // 30 minutes duration
  
  const translations = {
    en: {
      title: '🫙 Feed Your Sourdough Starter',
      description: 'Time to feed your sourdough starter! Mix flour and water according to your feeding schedule.',
      location: 'Kitchen',
      filename: 'sourdough-feeding.ics'
    },
    ru: {
      title: '🫙 Покормить Закваску',
      description: 'Время кормить закваску! Смешайте муку и воду согласно вашему графику кормления.',
      location: 'Кухня',
      filename: 'kormlenie-zakvaski.ics'
    }
  };
  
  const t = translations[language];
  
  const event: CalendarEvent = {
    title: t.title,
    description: t.description,
    startTime: feedingTime,
    endTime: eventEndTime,
    location: t.location
  };
  
  openCalendarEvent(event, t.filename);
}

/**
 * Check if the device supports calendar events
 */
export function supportsCalendarEvents(): boolean {
  // All modern browsers support blob downloads
  return typeof Blob !== 'undefined' && typeof URL !== 'undefined';
}
