# 🍞 La Petite Sourdough - Sourdough Baking App with Simple Steps and Automatic Timers

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](LICENSE)

**Live Demo**: [https://la-petite-sourdough.vercel.app](https://la-petite-sourdough.vercel.app)

A modern, intuitive sourdough baking companion with automatic timers, progress tracking, calendar integration, and a complete 16-step recipe guide with visual step-by-step images.

## ✨ Features

### 📖 Recipe Management
- **16-Step Recipe**: Complete sourdough guide from starter to baked loaf
- **Step-by-Step Images**: Full-color photo for every recipe step
- **Image Zoom**: Click any image to view full-screen with zoom capabilities
- **Step Navigation**: Previous/next buttons with progress tracking
- **Progress Tracking**: Visual indicators and completion percentage
- **Emoji-Enhanced Instructions**: 50+ contextual emojis (💧🌾🔥⏰) for visual clarity
- **Formatted Steps**: Bullet points with clear line breaks for easy reading
- **Bilingual Support**: Full Russian/English translations

### ⏱️ Smart Timers
- **Multiple Timers**: Independent timers for each recipe step
- **Background Tracking**: Timers continue even when tab is inactive
- **Audio Notifications**: Bell sound with automatic fallback system
- **Flexible Durations**: Min/max ranges for steps with variable times
- **Calendar Integration**: Add any timer to your device calendar with one click

### 📅 Calendar Integration
- **Add to Calendar Button**: On every timer for easy scheduling
- **Platform Detection**: Automatically opens Google Calendar (Android), Apple Calendar (iOS), or web interface (desktop)
- **No Downloads**: Works with native calendar apps via URL schemes
- **Smart Reminders**: Calendar events include step title, duration, and notification reminders
- **Bilingual Events**: Calendar descriptions in both languages

### 🖼️ Image Zoom & Gestures
- **Click-to-Zoom**: Tap any step image to view full-screen
- **Pinch-to-Zoom**: Mobile gesture support (1x-5x scale)
- **Double-Tap**: Quick toggle between normal and 2.5x zoom
- **Drag-to-Pan**: Move around zoomed images
- **Mobile Optimized**: Touch gestures designed for cooking with messy hands

### 📏 International Measurements
- **Dual Temperature Units**: All temps shown in Celsius and Fahrenheit (e.g., 250°C / 480°F)
- **Weight Conversions**: Metric and imperial weights (grams and ounces)
- **Accessibility**: Makes recipe usable for international audience

### 🏺 Starter Management
- **Feed Workflow**: Step-by-step starter feeding process
- **Visual Progress**: Animated jar with feeding stages
- **7-Day Guide**: Complete starter creation walkthrough
- **Smart Timing**: 4-8 hour fermentation timer with persistence

### 📝 Baking Journal
- **Session Notes**: Record observations for each bake
- **Categorization**: Success/failure/learning tags
- **Metadata Tracking**: Date, time, and custom notes
- **Persistent Storage**: All notes saved in localStorage

### 💡 Tips & Help
- **Quick Tips**: Beginner-friendly sourdough advice
- **Troubleshooting**: Common problems and solutions
- **Pro Secrets**: Advanced techniques for better bread

### 🎨 Design System
- **Warm Color Palette**: Cozy, bakery-inspired theme
- **Custom Components**: shadcn/ui with Radix primitives
- **Smooth Animations**: Framer Motion transitions
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **Footer**: Copyright, contact links, and illustration credits

### 🌍 Internationalization
- **Language Toggle**: Switch between English/Russian instantly
- **Global State**: Zustand-powered language persistence
- **Complete Translation**: Every page and component translated

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

```bash
cd /Users/pavelklug/Documents/Code/nextjs/smart-sourdough
```

2. **Install dependencies**

```bash
npm install
```

Required packages will be installed:
- next, react, react-dom
- @types/node, @types/react, @types/react-dom
- typescript
- tailwindcss, postcss, autoprefixer
- zustand
- framer-motion
- lucide-react
- @radix-ui/react-slot, @radix-ui/react-progress
- class-variance-authority, clsx, tailwind-merge

3. **Add a custom bell sound** (Optional Enhancement)

The app includes an automatic audio notification system with multiple fallbacks. For a custom bell sound, place your audio file at `public/sounds/bell.mp3`. 

**Built-in Fallback System:**
- Primary: HTML5 Audio (bell.mp3 if available)
- Secondary: Web Audio API with fetch
- Tertiary: Generated beep sound

This ensures notifications always work, even without a custom sound file. Free bell sounds available at:
- https://freesound.org/
- https://mixkit.co/free-sound-effects/bell/

4. **Run the development server**

```bash
npm run dev
```

5. **Open the app**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
smart-sourdough/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard and sub-pages
│   │   ├── feed/               # Starter feeding workflow
│   │   ├── notes/              # Baking journal
│   │   ├── starter-guide/      # 7-day starter guide
│   │   ├── tips/               # Tips & troubleshooting
│   │   └── page.tsx            # Main dashboard
│   ├── recipe/                  # Main recipe page
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── design-system/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── TopNav.tsx
│   │   ├── BottomTab.tsx
│   │   └── ...
│   ├── StepCard.tsx            # Recipe step display
│   ├── TimerControl.tsx        # Timer UI with calendar button
│   ├── ImageZoom.tsx           # Full-screen image viewer with gestures
│   ├── Footer.tsx              # Copyright and credits
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── useLanguage.ts          # Global language state
│   ├── useTimer.ts             # Feed timer state
│   └── useBackgroundTimers.ts  # Recipe timer tracking
├── store/                        # Zustand state management
│   └── useRecipeStore.ts       # Recipe progress & timers
├── lib/                          # Utility functions
│   ├── parseRecipe.ts          # Recipe markdown parser
│   ├── audioUtils.ts           # Notification sounds with fallbacks
│   └── calendarUtils.ts        # Calendar integration (iOS/Android/Desktop)
├── sourdough-data/              # Recipe data
│   ├── recipe.md               # Recipe content (formatted with emojis)
│   └── ramp.json               # Feeding schedule data
├── scripts/                      # Build scripts
│   └── build-recipe.js         # Generates recipe.json from markdown
└── public/                       # Static assets
    ├── sounds/
    │   └── bell.mp3            # Timer notification sound (optional)
    └── images/
        └── steps/              # Recipe step images
            ├── step-1.jpg      # 16 high-quality step photos
            ├── step-2.jpg
            └── ...
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.33 (App Router, Static Generation)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Animations**: Framer Motion (with touch gesture support)
- **Icons**: Lucide React
- **Fonts**: Fredoka (display), Inter (body)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Calendar**: iCalendar (.ics) format with platform-specific URL schemes
- **Audio**: Web Audio API with three-tier fallback system

## 🎯 Key Features Explained

### Timer System

The app uses two timer systems:

1. **Global Feed Timer** (`useTimer` hook) - Single 4-8 hour fermentation timer
2. **Recipe Timers** (`useRecipeStore`) - Per-step timers with different durations

Both systems:
- Use `startTime` timestamps for accurate background tracking
- Persist to localStorage
- Play audio notifications on completion
- Display simultaneously on dashboard

### Calendar Integration

Each timer includes an "Add to Calendar" button that:
- Detects your device platform (Android/iOS/Desktop)
- Creates an iCalendar (.ics) event with proper formatting
- Opens native calendar app via URL schemes:
  - **Android**: `https://calendar.google.com/calendar/render?action=TEMPLATE&...`
  - **iOS/macOS**: `data:text/calendar;charset=utf8,${encoded_ics}`
  - **Desktop**: Google Calendar web interface
- Includes reminder notifications 5 minutes before timer completion
- Works without any downloads or external services

### Image Zoom System

The `ImageZoom` component provides:
- **Click/Tap**: Opens full-screen modal with image centered
- **Double-Tap Detection**: Uses 300ms threshold to detect double-tap, toggles between 1x and 2.5x zoom
- **Pinch-to-Zoom**: Calculates distance between two touch points using `Math.hypot()`, scales image 1x-5x
- **Drag-to-Pan**: When zoomed in (scale > 1x), enables drag gestures with constraints
- **Touch Optimizations**: `touch-none`, `select-none`, `pointer-events-none` classes for smooth mobile experience

### Audio Notification System

Three-tier fallback ensures notifications always work:

1. **HTML5 Audio** (Primary): Loads `/sounds/bell.mp3` if available, most reliable and works in background
2. **Web Audio API** (Secondary): Uses AudioContext with `fetch()` and `decodeAudioData()` for better compatibility
3. **Generated Beep** (Fallback): Creates bell sound using oscillators with Web Audio API, guaranteed to work

All tiers include error handling and automatic progression to next fallback if one fails.

### Recipe Parser

Recipes are stored in markdown format with embedded JSON:

```json
{
  "id": 1,
  "title_en": "Mix Ingredients",
  "title_ru": "Смешать Ингредиенты",
  "instruction_en": "Combine flour, water...",
  "instruction_ru": "Соедините муку, воду...",
  "duration_min": 30,
  "duration_max": 40
}
```

The build script (`scripts/build-recipe.js`) parses markdown and generates `recipe.json` for the app.

### Language System

Global language state with Zustand:
- Stored in `localStorage` as `dope-dough:language`
- Available via `useLanguage()` hook on any page
- Instant switching without page reload

## 📱 Routes

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/dashboard/feed` - Starter feeding workflow
- `/dashboard/starter-guide` - 7-day starter creation guide
- `/dashboard/notes` - Baking journal
- `/dashboard/tips` - Tips & troubleshooting
- `/recipe` - 16-step sourdough recipe

## 🎨 Design Tokens

```css
--warm-bg: #FBF6EE        /* Warm beige background */
--primary: #D96D3A        /* Orange */
--secondary: #76A98B      /* Green */
--text-primary: #2D2D2D   /* Dark gray */
--text-secondary: #6B7280 /* Medium gray */
```

## 📄 License

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License** (CC BY-SA 4.0).

### What this means:

✅ **You CAN:**
- Use this app for personal or commercial purposes
- Modify and build upon this code
- Share and redistribute

⚠️ **You MUST:**
- **Credit Pavel Klug** as the original author
- Provide a link to this repository
- Share your modifications under the same license
- **If you profit from this app**, you must credit prominently and share your derivative work

See the [LICENSE](LICENSE) file for full details.

## 👨‍💻 Author & Credits

**Made with ❤️ by Pavel Klug**

- Email: [pavelklug@gmail.com](mailto:pavelklug@gmail.com)
- GitHub: [@PavelK-at-964784600414](https://github.com/PavelK-at-964784600414)
- Repository: [dope-dough](https://github.com/PavelK-at-964784600414/dope-dough)

**Illustrations**: Ariella Secret Garden

**Copyright**: © 2025 La Petite Sourdough. All rights reserved.

## 🙏 Acknowledgments

- Sourdough baking community for recipe inspiration and testing
- Next.js team for the amazing framework
- Framer Motion for gesture support
- Open source contributors
- Everyone who loves fresh-baked bread 🍞

## 🐛 Found a Bug?

Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Have an idea? Open an issue with the "enhancement" label!

---

**Made with ❤️ and sourdough** by Pavel Klug
