import React, { ReactNode } from 'react';

export type SectionProps = {
  /** The content to be rendered inside the section. */
  children: ReactNode;
  /** Semantic vertical spacing variant. Default is 'md'. */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Semantic background color variant. Default is 'transparent'. */
  background?: 'transparent' | 'surface' | 'muted';
  /** Whether the section should have a top border. */
  withBorder?: boolean;
  /** Optional standard Tailwind utility classes to append. */
  className?: string;
  /** Optional HTML id for deep linking. */
  id?: string;
};

/**
 * A semantic HTML section wrapper that enforces consistent vertical spacing,
 * backgrounds, and structural borders across TrekBazaar.
 */
export function Section({
  children,
  spacing = 'md',
  background = 'transparent',
  withBorder = false,
  className = '',
  id,
}: SectionProps) {
  // Semantic vertical spacing
  const spacingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-16 sm:py-24',
    lg: 'py-24 sm:py-32',
  };

  // Semantic background colors using tokens
  const backgroundClasses = {
    transparent: 'bg-transparent',
    surface: 'bg-tb-surface',
    muted: 'bg-tb-sys-background',
  };

  const borderClass = withBorder ? 'border-t border-tb-border' : '';

  const combinedClasses = [
    spacingClasses[spacing],
    backgroundClasses[background],
    borderClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section id={id} className={combinedClasses}>
      {children}
    </section>
  );
}
