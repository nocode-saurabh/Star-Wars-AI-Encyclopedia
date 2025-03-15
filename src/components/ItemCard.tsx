
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ItemCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  details?: Array<{label: string; value: string | number}>;
  index?: number;
  className?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  subtitle,
  category,
  details = [],
  index = 0,
  className,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={cn("h-full", className)}
    >
      <Link to={`/category/${category}/${id}`} className="block h-full">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="h-full relative border border-white/10 bg-card/70 rounded-xl p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-neon-subtle group"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
              
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            
            <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
          
          {details.length > 0 && (
            <div className="mt-4 space-y-2">
              {details.map((detail, index) => (
                <div key={index} className="grid grid-cols-2 text-sm">
                  <span className="text-muted-foreground">{detail.label}:</span>
                  <span className="text-white font-mono">{detail.value}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-primary/5 to-transparent rounded-xl pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ItemCard;
