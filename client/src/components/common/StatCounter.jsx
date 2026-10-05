import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function StatCounter({ value, duration = 0.8, prefix = '', suffix = '' }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [spring]);

  return (
    <span className="font-mono">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
