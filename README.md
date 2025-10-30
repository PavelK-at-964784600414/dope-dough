# 🍞 La Petite Sourdough - Sourdough Baking App with simlpe steps and automatic timers


https://dope-dough.vercel.app



A comprehensive sourdough bread baking companion app built with Next.js 14, featuring step-by-step recipes, starter management, timers, and a baking journal.A Next.js application th## 📝 Adding the Bell Sound (Optional)



![Made with Next.js](https://img.shields.io/badge/Next.js-14-black)The app now includes a **generated bell sound** as a fallback using Web Audio API, so audio notifications work out of the box!

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

![License](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey)However, for a more pleasant sound, you can add a real bell.mp3 file:



## ✨ Features1. Download a free bell sound from:

   - https://freesound.org/people/InspectorJ/sounds/411089/ (Recommended: Service Bell)

### 🥖 Recipe Management   - https://mixkit.co/free-sound-effects/bell/

- **16-Step Sourdough Recipe**: Detailed instructions from mixing to baking   - https://pixabay.com/sound-effects/search/bell/

- **Step-by-step Navigation**: Easy-to-follow cards with timers   

- **Quick Jump**: Navigate directly to any step2. Save as: `public/sounds/bell.mp3`

- **Progress Tracking**: Automatic completion tracking

- **Bilingual Support**: Full English/Russian translation3. Refresh the page - timer completions will now use your custom sound



### ⏰ Smart Timers**Current behavior:**

- **Multiple Timers**: Run recipe and starter timers simultaneously- ✅ Tries to load `public/sounds/bell.mp3` first

- **Background Tracking**: Timers persist across page navigation- ✅ Falls back to generated bell sound (Web Audio API) if file not found

- **Audio Notifications**: Bell sound alerts when timers complete- ✅ Works without any manual setup

- **Dashboard Integration**: View all active timers from dashboard

- **Flexible Durations**: Min/max options for fermentation times**To test the sound immediately:**

Open browser console and run:

### 🌾 Starter Management```javascript

- **Feed Starter Workflow**: 5-step feeding processconst audio = new Audio('/sounds/bell.mp3');

- **Visual Progress**: Animated starter jar showing growthaudio.volume = 0.7;

- **7-Day Starter Guide**: Complete beginner's guideaudio.play();

- **Activity Tracking**: Monitor starter health and readiness```



### 📝 Baking JournalIf you hear nothing, the file doesn't exist yet, but the fallback tone will play when timers complete.ovides step-by-step guidance for baking sourdough bread with intelligent timers, browser notifications, and persistent progress tracking.

- **Note Taking**: Log feedings, baking sessions, observations

- **Categorization**: 4 note types with unique icons and colors## Features

- **Metadata**: Temperature and ratio tracking for feedings

- **Time Stamps**: Smart "time ago" formatting- ⏱️ **Smart Timers** - Automatic countdown timers for each recipe step with min/max duration ranges

- **Persistent Storage**: All notes saved to localStorage- 🔔 **Multi-Channel Notifications** - Toast popups, browser notifications, and bell sound alerts

- 💾 **Persistent State** - Progress and timer states saved to localStorage (keys: `sourdough:progress`, `sourdough:timers`)

### 💡 Tips & Help- 🌐 **Bilingual Support** - Recipe available in English and Russian

- **Quick Tips**: 6 essential sourdough tips with icons- 🎨 **Modern UI** - Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and shadcn/ui

- **Troubleshooting Guide**: 6 common problems with solutions- 📱 **Mobile-First Design** - Responsive layout optimized for all devices

- **Severity Levels**: Color-coded issue importance- ⏰ **Background Timer Support** - Timers continue counting and notify you even when you switch tabs or apps

- **Pro Baker Secrets**: 6 advanced techniques

## Tech Stack

### 🎨 Design System

- **Warm Color Palette**: Bakery-inspired warm beige background- **Framework**: Next.js 14+ (App Router)

- **Custom Components**: Reusable Card, Button, Timeline components- **Language**: TypeScript

- **Fredoka Font**: Friendly display typography- **Styling**: Tailwind CSS

- **Responsive Design**: Mobile-first, works on all devices- **Animations**: Framer Motion

- **Smooth Animations**: Framer Motion transitions- **State Management**: Zustand with localStorage persistence

- **Icons**: Lucide React

### 🌍 Internationalization- **UI Components**: shadcn/ui (Radix UI primitives)

- **Language Toggle**: Switch between English/Russian instantly

- **Global State**: Zustand-powered language persistence## Installation

- **Complete Translation**: Every page and component translated

1. **Clone or navigate to the project directory**

## 🚀 Getting Started

```bash

### Prerequisitescd /Users/pavelklug/Documents/Code/nextjs/smart-sourdough

```

- Node.js 18+ 

- npm or yarn2. **Install dependencies**



### Installation```bash

npm install

1. Clone the repository```

```bash

git clone https://github.com/PavelK-at-964784600414/dope-dough.gitRequired packages will be installed:

cd dope-dough- next, react, react-dom

```- @types/node, @types/react, @types/react-dom

- typescript

2. Install dependencies- tailwindcss, postcss, autoprefixer

```bash- zustand

npm install- framer-motion

```- lucide-react

- @radix-ui/react-slot, @radix-ui/react-progress

3. Run the development server- class-variance-authority, clsx, tailwind-merge

```bash

npm run dev3. **Add a bell sound** (Optional)

```

Place a bell sound file at `public/sounds/bell.mp3`. If not provided, the app will still work but without audio alerts. Free sounds available at:

4. Open [http://localhost:3000](http://localhost:3000) in your browser- https://freesound.org/

- https://mixkit.co/free-sound-effects/bell/

## 📁 Project Structure

4. **Run the development server**

```

smart-sourdough/```bash

├── app/                          # Next.js App Router pagesnpm run dev

│   ├── dashboard/               # Dashboard and sub-pages```

│   │   ├── feed/               # Starter feeding workflow

│   │   ├── notes/              # Baking journal5. **Open the app**

│   │   ├── starter-guide/      # 7-day starter guide

│   │   ├── tips/               # Tips & troubleshootingNavigate to [http://localhost:3000](http://localhost:3000)

│   │   └── page.tsx            # Main dashboard

│   ├── recipe/                  # Main recipe page## Manual Testing

│   └── page.tsx                 # Landing page

├── components/                   # React components### Test 1: Basic Timer Functionality

│   ├── design-system/          # Reusable UI components

│   │   ├── Button.tsx1. Click "Start Baking" on the landing page

│   │   ├── Card.tsx2. Find "Step 1: Activate the starter" (4 hours timer)

│   │   ├── TopNav.tsx3. Click "Start" button on the timer

│   │   ├── BottomTab.tsx4. Verify:

│   │   └── ...   - Timer countdown begins (displays remaining time)

│   ├── StepCard.tsx            # Recipe step display   - Progress bar animates

│   ├── TimerControl.tsx        # Timer UI component   - "Pause" button appears

│   └── ...5. Click "Pause" - timer should stop

├── hooks/                        # Custom React hooks6. Click "Start" again - timer resumes from paused time

│   ├── useLanguage.ts          # Global language state7. Click reset icon - timer resets to 4 hours

│   ├── useTimer.ts             # Feed timer state

│   └── useBackgroundTimers.ts  # Recipe timer tracking### Test 2: Simulate Timer Completion

├── store/                        # Zustand state management

│   └── useRecipeStore.ts       # Recipe progress & timersTo quickly test completion without waiting:

├── lib/                          # Utility functions

│   ├── parseRecipe.ts          # Recipe markdown parser1. Open browser DevTools (F12)

│   └── audioUtils.ts           # Notification sounds2. Go to Console tab

├── sourdough-data/              # Recipe data3. Run this code to set a timer to 5 seconds:

│   ├── recipe.md               # Recipe content (JSON)

│   └── ramp.json               # Feeding schedule data```javascript

└── public/                       # Static assets// Find a timer in localStorage

    └── sounds/const stored = JSON.parse(localStorage.getItem('sourdough:timers'));

        └── bell.mp3            # Timer notification sound// Set step 1's timer to 5 seconds remaining

```stored.state.timers[1].remainingSeconds = 5;

stored.state.timers[1].totalSeconds = 5;

## 🛠️ Tech StacklocalStorage.setItem('sourdough:timers', JSON.stringify(stored));

// Reload page

- **Framework**: Next.js 14.2.33 (App Router)location.reload();

- **Language**: TypeScript 5```

- **Styling**: Tailwind CSS

- **State Management**: Zustand with persistence4. Start the timer for Step 1

- **Animations**: Framer Motion5. After 5 seconds, verify:

- **Icons**: Lucide React   - Toast notification appears (top-right corner)

- **Fonts**: Fredoka (display), Inter (body)   - Browser notification appears (if permission granted)

   - Bell sound plays (if bell.mp3 exists)

## 🎯 Key Features Explained   - Step is marked as completed (green checkmark)

   - Timer displays "Completed!" message

### Timer System

The app uses two timer systems:### Test 3: Browser Notifications

1. **Global Feed Timer** (`useTimer` hook) - Single 4-8 hour fermentation timer

2. **Recipe Timers** (`useRecipeStore`) - Per-step timers with different durations1. When you first start any timer, browser will request notification permission

2. Click "Allow" in the permission prompt

Both systems:3. Complete a timer (use Test 2 method)

- Use `startTime` timestamps for accurate background tracking4. Verify browser notification appears with:

- Persist to localStorage   - Title: "Timer Completed! 🎉"

- Play audio notifications on completion   - Body: "Step [number]: [step title]"

- Display simultaneously on dashboard   - Notification is clickable and brings window to focus



### Recipe Parser**Troubleshooting Notifications:**

Recipes are stored in markdown format with embedded JSON:- If notification doesn't appear, check browser notification settings

```json- In Chrome: Settings → Privacy and Security → Site Settings → Notifications

{- Ensure notifications are allowed for localhost:3000

  "id": 1,

  "title_en": "Mix Ingredients",### Test 4: localStorage Persistence

  "title_ru": "Смешать Ингредиенты",

  "instruction_en": "Combine flour, water...",1. Start multiple timers (e.g., Steps 1, 2, and 4)

  "instruction_ru": "Соедините муку, воду...",2. Pause Step 2 timer at a specific time (note the remaining time)

  "duration_min": 30,3. Close the browser tab completely

  "duration_max": 404. Reopen [http://localhost:3000/recipe](http://localhost:3000/recipe)

}5. Verify:

```   - All timer states are restored

   - Step 2 timer shows the same remaining time

### Language System   - Completed steps remain marked as completed

Global language state with Zustand:   - Progress counter is accurate

- Stored in `localStorage` as `dope-dough:language`

- Available via `useLanguage()` hook on any page**Check localStorage manually:**

- Instant switching without page reload```javascript

// In browser console

## 📱 Routesconsole.log(JSON.parse(localStorage.getItem('sourdough:timers')));

```

- `/` - Landing page

- `/dashboard` - Main dashboardShould show:

- `/dashboard/feed` - Starter feeding workflow```json

- `/dashboard/starter-guide` - 7-day starter creation guide{

- `/dashboard/notes` - Baking journal  "state": {

- `/dashboard/tips` - Tips & troubleshooting    "progress": {

- `/recipe` - 16-step sourdough recipe      "currentStepIndex": 0,

      "completedSteps": [1, 2]

## 🎨 Design Tokens    },

    "timers": {

```css      "1": { "stepId": 1, "remainingSeconds": 3600, ... }

--warm-bg: #FBF6EE        /* Warm beige background */    }

--primary: #D96D3A        /* Orange */  },

--secondary: #76A98B      /* Green */  "version": 0

--text-primary: #2D2D2D   /* Dark gray */}

--text-secondary: #6B7280 /* Medium gray */```

```

### Test 5: Min/Max Duration Toggle

## 📄 License

Steps with duration ranges (e.g., Step 2: 6-8 hours) have a toggle button:

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License** (CC BY-SA 4.0).

1. Navigate to Step 2 "Prepare the levain"

### What this means:2. Timer initially shows "Min: 6h" button

3. Click the button

✅ **You CAN:**4. Verify:

- Use this app for personal or commercial purposes   - Button changes to "Max: 8h"

- Modify and build upon this code   - Timer resets to 8 hours (28800 seconds)

- Share and redistribute5. Click again - timer resets back to 6 hours (21600 seconds)



⚠️ **You MUST:**### Test 6: Bulk Controls

- **Credit Pavel Klug** as the original author

- Provide a link to this repository1. Start 3-4 individual timers

- Share your modifications under the same license2. Click "Pause All" button at the top

- **If you profit from this app**, you must credit prominently and share your derivative work3. Verify all running timers pause simultaneously

4. Click "Start All Timers"

See the [LICENSE](LICENSE) file for full details.5. Verify all non-completed timers start together

6. Click "Reset All"

## 👨‍💻 Author7. Confirm dialog appears

8. Accept - all timers reset and progress clears

**Pavel Klug**

### Test 7: Long-Running Timers

- GitHub: [@PavelK-at-964784600414](https://github.com/PavelK-at-964784600414)

- Repository: [dope-dough](https://github.com/PavelK-at-964784600414/dope-dough)Some steps have very long timers (e.g., Step 7: 16 hours cold proof):



## 🙏 Acknowledgments1. Start Step 7 timer

2. Verify timer displays "16h" correctly

- Sourdough baking community for recipe inspiration3. Check that timer persists through:

- Next.js team for the amazing framework   - Browser refresh

- Open source contributors   - Computer sleep/wake

   - Browser restart

## 🐛 Found a Bug?4. **Switch to another tab or app** for 1-2 minutes

5. Return to the recipe tab

Please open an issue on GitHub with:6. Verify the timer has progressed correctly during your absence

- Description of the bug7. If a timer completed while away, you'll get the notification immediately upon returning

- Steps to reproduce

- Expected vs actual behavior**Background Timer Behavior:**

- Screenshots if applicable- Uses timestamp-based tracking (not dependent on `setInterval`)

- Calculates elapsed time when page becomes visible: `elapsed = now - startTime`

## 💡 Feature Requests- Automatically triggers notifications for timers that completed while tab was inactive

- Works even after computer sleep/wake cycles

Have an idea? Open an issue with the "enhancement" label!

### Test 8: Language Switching

---

1. On recipe page, click "RU" button (top-right)

**Made with ❤️ and sourdough** by Pavel Klug2. Verify:

   - All step titles and instructions switch to Russian
   - UI labels remain functional
3. Click "EN" - content switches back to English

### Test 9: Mobile Responsiveness

1. Open DevTools and toggle device emulation (Ctrl+Shift+M)
2. Test on various screen sizes:
   - Mobile (320px, 375px, 414px)
   - Tablet (768px, 1024px)
3. Verify:
   - Cards stack vertically on mobile
   - Buttons remain accessible
   - Timer controls are thumb-friendly
   - Notifications don't overflow screen

### Test 10: Multiple Overlapping Timers

1. Start timers for Steps 1, 2, and 3 simultaneously
2. Let Step 1 complete (use simulation method from Test 2)
3. Verify:
   - First notification appears
   - Other timers continue running
4. Let Step 2 complete
5. Verify:
   - Second notification stacks below first notification
   - Both notifications auto-dismiss after 10 seconds

### Test 11: Background Timer Completion (New!)

Test that timers complete and notify even when you're not viewing the page:

1. Start a 10-second timer using the console method from Test 2:
```javascript
const stored = JSON.parse(localStorage.getItem('sourdough:timers'));
stored.state.timers[1].remainingSeconds = 10;
stored.state.timers[1].totalSeconds = 10;
localStorage.setItem('sourdough:timers', JSON.stringify(stored));
location.reload();
```

2. Start the timer for Step 1
3. **Immediately switch to a different tab or app**
4. Wait 15 seconds (timer will complete while you're away)
5. Return to the recipe tab
6. Verify:
   - Timer shows as completed
   - Notification appears immediately
   - Bell sound plays (if available)
   - Step is marked with green checkmark

**This proves the timer continues in the background!**

## Project Structure

```
smart-sourdough/
├── app/
│   ├── api/
│   │   └── recipe/
│   │       └── route.ts          # API route to fetch parsed recipe
│   ├── recipe/
│   │   └── page.tsx              # Main recipe page with timers
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   ├── Notification.tsx          # Toast and browser notification handler
│   ├── StepCard.tsx              # Recipe step card with metadata
│   └── TimerControl.tsx          # Timer UI with controls
├── lib/
│   ├── parseRecipe.ts            # Recipe JSON parser and utilities
│   └── utils.ts                  # Tailwind className merger
├── store/
│   └── useRecipeStore.ts         # Zustand store with localStorage
├── sourdough-data/
│   ├── recipe.md                 # Source recipe with JSON steps
│   └── ramp.json                 # Project configuration
└── public/
    └── sounds/
        └── bell.mp3              # Bell sound for timer completion
```

## Development Notes

### Modular Architecture

- **parseRecipe.ts**: Handles extraction and normalization of recipe data from markdown
- **useRecipeStore.ts**: Centralized state management with automatic persistence
- **Component separation**: StepCard (display), TimerControl (logic), Notification (alerts)

### Future Enhancements

Potential improvements for future iterations:

1. **Service Worker**: Background timer that works even when tab is closed
2. **Recipe Selection**: Support multiple recipes, not just sourdough
3. **Custom Timers**: Allow users to add their own timer steps
4. **Export/Import**: Share timer state between devices via JSON export
5. **Analytics**: Track which steps users find most helpful
6. **Voice Alerts**: Text-to-speech announcements for timer completion
7. **Dark Mode**: Theme toggle for different lighting conditions

## Troubleshooting

### Timers Not Persisting

- Check browser localStorage is enabled (not in private/incognito mode)
- Verify localStorage key: `sourdough:timers` exists in DevTools → Application → Local Storage

### Notifications Not Showing

- Ensure notification permission is granted
- Check browser notification settings
- Try restarting browser
- Test in a different browser (Chrome, Firefox, Safari)

### Audio Not Playing

- Verify `public/sounds/bell.mp3` exists
- Check browser audio permissions
- Ensure browser tab is not muted
- Try a different audio file format

### Type Errors During npm install

If you see TypeScript errors, ensure you have these packages:

```bash
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

## License

MIT - Feel free to use this project for personal or commercial purposes.

## Credits

Recipe adapted from traditional sourdough baking methods. Built with modern web technologies for an optimal baking experience.
