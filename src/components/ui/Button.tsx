import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style variant of the button. Default is 'primary'. */
  variant?: ButtonVariant;
  /** The dimensional size of the button. Default is 'md'. */
  size?: ButtonSize;
  /** Replaces the left icon (or content) with a spinner and disables the button. */
  isLoading?: boolean;
  /** Forces the button to span 100% of its parent's width. */
  fullWidth?: boolean;
  /** Icon element to render before the children. */
  leftIcon?: ReactNode;
  /** Icon element to render after the children. */
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-tb-primary text-white hover:bg-tb-primary-hover shadow-tb-subtle border border-transparent',
  secondary: 'bg-transparent text-tb-secondary border border-tb-secondary hover:bg-tb-sys-background',
  outline: 'bg-transparent text-tb-text-primary border border-tb-border hover:bg-tb-sys-background',
  ghost: 'bg-transparent text-tb-text-primary hover:bg-tb-sys-background border border-transparent',
  danger: 'bg-tb-danger text-white hover:bg-red-600 shadow-tb-subtle border border-transparent',
  link: 'bg-transparent text-tb-primary hover:underline border-transparent p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10 p-2 justify-center',
};

/**
 * The unified Button component for TrekBazaar.
 * Built for accessibility, strict design token adherence, and composability.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles guarantee accessibility (focus rings) and micro-interactions
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-tb-md active:scale-[0.98]';
    
    const widthStyle = fullWidth ? 'w-full' : '';
    const appliedSizeStyle = variant === 'link' ? '' : sizeStyles[size];

    const combinedClasses = [
      baseStyles,
      variantStyles[variant],
      appliedSizeStyle,
      widthStyle,
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClasses}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
