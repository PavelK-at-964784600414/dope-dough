import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] active:shadow-sm',
        secondary:
          'bg-secondary-400 text-white shadow-md hover:bg-secondary-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] active:shadow-sm',
        outline:
          'border-2 border-primary-500 text-primary-500 bg-surface hover:bg-primary-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        ghost:
          'text-text-primary hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100',
        soft:
          'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]',
        success:
          'bg-success text-white shadow-md hover:bg-secondary-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] active:shadow-sm',
        danger:
          'bg-error text-white shadow-md hover:bg-error/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] active:shadow-sm',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-11 w-11',
      },
      rounded: {
        default: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

/**
 * USAGE EXAMPLES:
 * 
 * // Primary button
 * <Button>Feed Starter</Button>
 * 
 * // Secondary button with icon
 * <Button variant="secondary" size="lg">
 *   <TimerIcon /> Start Timer
 * </Button>
 * 
 * // Outline button
 * <Button variant="outline">View Recipe</Button>
 * 
 * // Ghost button (minimal)
 * <Button variant="ghost" size="sm">Cancel</Button>
 * 
 * // Soft button (subtle background)
 * <Button variant="soft">Ready in ~4 hours</Button>
 * 
 * // Loading state
 * <Button isLoading>Saving...</Button>
 * 
 * // Disabled
 * <Button disabled>Completed</Button>
 * 
 * // Full rounded
 * <Button rounded="full" size="icon">
 *   <PlusIcon />
 * </Button>
 */
