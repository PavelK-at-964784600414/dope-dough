'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  label?: string;
  description?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ pressed = false, onPressedChange, label, description, className, children, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(pressed);

    React.useEffect(() => {
      setIsPressed(pressed);
    }, [pressed]);

    const handleToggle = () => {
      const newState = !isPressed;
      setIsPressed(newState);
      onPressedChange?.(newState);
    };

    return (
      <div className="flex items-start gap-4">
        <button
          ref={ref}
          role="switch"
          aria-checked={isPressed}
          aria-label={label || 'Toggle'}
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            isPressed ? 'bg-primary-500 shadow-glow-sm' : 'bg-borderColor',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300',
              isPressed ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        {(label || description) && (
          <div className="flex flex-col gap-1">
            {label && (
              <label className="text-sm font-medium text-text-primary cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-text-secondary">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };

/**
 * USAGE EXAMPLES:
 * 
 * // Basic toggle
 * <Toggle 
 *   pressed={isDarkMode} 
 *   onPressedChange={setIsDarkMode}
 *   label="Dark Mode"
 * />
 * 
 * // With description
 * <Toggle
 *   pressed={notificationsEnabled}
 *   onPressedChange={setNotificationsEnabled}
 *   label="Enable Notifications"
 *   description="Get alerts when timers complete"
 * />
 * 
 * // Controlled
 * const [active, setActive] = useState(false);
 * <Toggle
 *   pressed={active}
 *   onPressedChange={setActive}
 *   label="Timer Active"
 * />
 * 
 * // Disabled
 * <Toggle
 *   disabled
 *   label="Coming Soon"
 *   description="This feature is not available yet"
 * />
 */
