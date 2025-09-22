import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({ children, className, padding = "md" }) => {
  const paddingClasses = {
    none: "",
    sm: "p-3 lg:p-4",
    md: "p-4 lg:p-6",
    lg: "p-6 lg:p-8",
  };

  return (
    <div
      className={clsx(
        "bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
