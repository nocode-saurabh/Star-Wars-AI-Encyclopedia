
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!titleRef.current) return;
    
    const title = titleRef.current;
    const letters = title.innerText.split("");
    
    title.innerHTML = "";
    
    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.innerText = letter;
      span.style.animationDelay = `${index * 0.05}s`;
      span.className = "inline-block animate-fade-in opacity-0";
      
      if (letter === " ") {
        span.innerHTML = "&nbsp;";
      }
      
      title.appendChild(span);
    });
  }, []);
  
  return (
    <section className={cn("min-h-screen w-full flex flex-col items-center justify-center relative px-6", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-dark z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center relative z-20 max-w-4xl"
      >
        <h1 
          ref={titleRef}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent leading-tight"
        >
          The Galaxy Awaits
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Explore the Star Wars universe through characters, planets, films, and more in this comprehensive encyclopedia.
        </p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#categories"
            className="px-8 py-3 rounded-md bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-lg shadow-primary/20"
          >
            Explore Now
          </a>
          <a
            href="#films"
            className="px-8 py-3 rounded-md bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium transition-colors"
          >
            View Films
          </a>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
      >
        <a 
          href="#categories"
          className="flex flex-col items-center text-muted-foreground hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Scroll to Explore</span>
          <ChevronDown className="animate-float" size={24} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
