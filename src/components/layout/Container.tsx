import React, { ReactNode } from 'react';

export type ContainerProps = {
  /** The content to be rendered inside the container. */
  children: ReactNode;
  /** The max-width variant for the container. Default is 'app' (1200px). */
  variant?: 'app' | 'reading' | 'content' | 'fluid';
  /** Optional standard Tailwind utility classes to append. */
  className?: string;
  /** Semantic HTML element to render. Default is 'div'. */
  as?: React.ElementType;
};

/**
 * A highly reusable container component to maintain consistent responsive 
 * padding and maximum widths across the application.
 */
export function Container({ 
  children, 
  variant = 'app', 
  className = '', 
  as: Component = 'div' 
}: ContainerProps) {
  // Base padding for responsiveness
  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8 w-full';
  
  // Max width variants relying on TrekBazaar design tokens
  const variantClasses = {
    app: 'max-w-[var(--container-app)]',
    reading: 'max-w-[var(--container-reading)]',
    content: 'max-w-[var(--container-content)]',
    fluid: 'max-w-none',
  };

  const combinedClasses = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return <Component className={combinedClasses}>{children}</Component>;
}
