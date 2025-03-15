
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import StarField from "./StarField";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      <StarField />
      <Navbar />
      <main className={cn("flex-1 pt-20", className)}>
        {children}
      </main>
      <footer className="py-8 px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary text-glow">StarWars</span>
                <span className="text-sm font-light text-white/80">Encyclopedia</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All Star Wars data provided by SWAPI - The Star Wars API
              </p>
            </div>
            <div className="flex gap-6 text-muted-foreground">
              <a href="https://swapi.dev" className="hover:text-white transition-colors text-sm">
                SWAPI
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs text-muted-foreground mt-8">
            This is a fan-made encyclopedia and is not affiliated with or endorsed by Disney or Lucasfilm Ltd.
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Layout;
