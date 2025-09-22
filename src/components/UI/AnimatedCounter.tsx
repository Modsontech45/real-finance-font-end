import React, { useEffect, useState } from "react";
import { useAppearance } from "../../contexts/AppearanceContext";
import { formatCurrency } from "../../utils/currencies";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  useCurrency?: boolean;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  prefix = "",
  suffix = "",
  useCurrency = false,
  className = "",
}) => {
  const { settings } = useAppearance();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatValue = () => {
    if (useCurrency) {
      return formatCurrency(displayValue, settings.currency);
    }
    return `${prefix}${displayValue.toLocaleString()}${suffix}`;
  };
  return <span className={className}>{formatValue()}</span>;
};

export default AnimatedCounter;
