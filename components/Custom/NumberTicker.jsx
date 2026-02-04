import { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native';

export default function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className = "",
  style = {},
  decimals = 0,
}) {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
  const parsedStartValue = typeof startValue === 'string' ? parseFloat(startValue) : startValue;

  const safeValue = typeof parsedValue === 'number' && !isNaN(parsedValue) ? parsedValue : 0;
  const safeStartValue = typeof parsedStartValue === 'number' && !isNaN(parsedStartValue) ? parsedStartValue : 0;

  const [displayValue, setDisplayValue] = useState(safeStartValue);
  const animationRef = useRef(null);
  const previousValueRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fromValue = isFirstRender.current ? safeStartValue : displayValue;
    const targetValue = direction === "down" ? safeStartValue : safeValue;

    if (!isFirstRender.current && safeValue === previousValueRef.current) return;

    isFirstRender.current = false;
    previousValueRef.current = safeValue;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const duration = 600;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = fromValue + (targetValue - fromValue) * easeOut;

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [safeValue, safeStartValue, direction, delay]);

  const safeDisplayValue = typeof displayValue === 'number' && !isNaN(displayValue) ? displayValue : safeStartValue;

  const formattedValue = decimals > 0
    ? safeDisplayValue.toFixed(decimals)
    : Math.round(safeDisplayValue).toString();

  const formattedWithSeparators = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Text
      className={className}
      style={[{ fontVariant: ['tabular-nums'] }, style]}
    >
      {formattedWithSeparators}
    </Text>
  );
}
