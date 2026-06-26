"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface SmoothCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
}

export function SmoothCounter({ value, duration = 2, format }: SmoothCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  // Spring config for smooth interpolation
  const spring = useSpring(0, {
    bounce: 0,
    duration: shouldReduceMotion ? 0.01 : duration * 1000
  });
  
  // Transform the spring value to a rounded number string
  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    return format ? format(rounded) : rounded.toString();
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  // Avoid hydration mismatch by rendering static value on server
  if (!mounted) {
    return <span>{format ? format(value) : value}</span>;
  }

  return <motion.span>{display}</motion.span>;
}
