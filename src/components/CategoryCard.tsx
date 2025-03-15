
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  index?: number;
  className?: string;
  backgroundImage?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  path,
  icon,
  index = 0,
  className,
  backgroundImage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className={cn(
        "group relative perspective-container",
        className
      )}
    >
      <Link to={path}>
        <div 
          className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-card/80 to-card transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-neon-subtle h-full"
          style={backgroundImage ? {
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {icon}
              </div>
              <ChevronRight 
                size={20} 
                className="text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" 
              />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-primary/10 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
