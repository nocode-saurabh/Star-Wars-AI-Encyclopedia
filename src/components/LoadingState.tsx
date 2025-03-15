
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  text?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  text = "Loading data from across the galaxy...",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20", className)}>
      <div className="relative w-16 h-16 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-accent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
        </div>
      </div>
      <p className="text-lg text-muted-foreground animate-pulse-subtle">{text}</p>
    </div>
  );
};

export default LoadingState;
