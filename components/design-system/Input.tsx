import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-surface px-4 py-3 text-base font-body transition-all duration-300 placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-borderColor hover:border-primary-300',
        error: 'border-error focus-visible:ring-error',
        success: 'border-success focus-visible:ring-success',
      },
      inputSize: {
        sm: 'h-9 px-3 py-2 text-sm rounded-lg',
        md: 'h-11 px-4 py-3 text-base',
        lg: 'h-14 px-6 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      helperText,
      error,
      icon,
      iconPosition = 'left',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, inputSize }),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };

/**
 * USAGE EXAMPLES:
 * 
 * // Basic input
 * <Input placeholder="Enter starter name" />
 * 
 * // With label and helper text
 * <Input
 *   label="Starter Name"
 *   placeholder="My Sourdough"
 *   helperText="Give your starter a friendly name"
 * />
 * 
 * // With icon
 * <Input
 *   label="Search recipes"
 *   placeholder="Search..."
 *   icon={<SearchIcon className="h-5 w-5" />}
 *   iconPosition="left"
 * />
 * 
 * // Error state
 * <Input
 *   label="Feeding amount"
 *   type="number"
 *   error="Please enter a valid amount"
 * />
 * 
 * // Success state
 * <Input
 *   label="Email"
 *   type="email"
 *   variant="success"
 * />
 * 
 * // Large size
 * <Input
 *   inputSize="lg"
 *   placeholder="Notes about this feeding..."
 * />
 */
