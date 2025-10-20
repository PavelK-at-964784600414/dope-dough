import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-surface shadow-md border border-borderColor-light',
        glass: 'bg-surface/80 backdrop-blur-sm shadow-lg border border-borderColor-light',
        elevated: 'bg-surface shadow-xl border border-borderColor-light hover:shadow-2xl hover:-translate-y-1',
        flat: 'bg-surface border border-borderColor',
        soft: 'bg-primary-50 border border-primary-100',
        success: 'bg-success-light border border-secondary-200',
        warning: 'bg-warning-light border border-warning',
        glow: 'bg-surface shadow-glow-sm border border-primary-200',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-display text-2xl font-semibold tracking-tight text-text-primary', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };

/**
 * USAGE EXAMPLES:
 * 
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Feed Your Starter</CardTitle>
 *     <CardDescription>Keep your sourdough happy and active</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Add ½ tsp starter + 20g water + 20g flour
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Start Timer</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // Glass effect card (translucent)
 * <Card variant="glass" padding="lg">
 *   <CardTitle>Recipe Steps</CardTitle>
 * </Card>
 * 
 * // Elevated card with hover effect
 * <Card variant="elevated" interactive>
 *   <CardHeader>
 *     <CardTitle>Bulk Fermentation</CardTitle>
 *     <CardDescription>~4 hours at room temp</CardDescription>
 *   </CardHeader>
 * </Card>
 * 
 * // Success state card
 * <Card variant="success">
 *   <CardTitle>Starter is Active!</CardTitle>
 * </Card>
 * 
 * // Soft colored card
 * <Card variant="soft" padding="sm">
 *   <p>Tip: Store in fridge if not baking today</p>
 * </Card>
 */
