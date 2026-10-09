import { useState, useEffect } from 'react';

/**
 * Custom hook that delays updating the returned debounced value
 * until a specified delay has passed since the last change.
 * 
 * @param {*} value The value to debounce
 * @param {number} delay Milliseconds to delay (default: 300ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
