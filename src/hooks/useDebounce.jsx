import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a changing value
 * @param {any} value The value to debounce
 * @param {number} delay Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer when the value changes
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel previous timer on value or delay change
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export default useDebounce;