
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: "Films", path: "/category/films" },
    { name: "Characters", path: "/category/people" },
    { name: "Planets", path: "/category/planets" },
    { name: "Species", path: "/category/species" },
    { name: "Vehicles", path: "/category/vehicles" },
    { name: "Starships", path: "/category/starships" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
      isScrolled ? "py-2 bg-black/50 backdrop-blur-lg" : "py-4 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-white relative z-20 flex items-center gap-2"
        >
          <span className="text-glow text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            StarWars
          </span>
          <span className="text-lg font-light tracking-wider">Encyclopedia</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                location.pathname.startsWith(item.path)
                  ? "text-primary"
                  : "text-white/80 hover:text-white"
              )}
            >
              {item.name}
              {location.pathname.startsWith(item.path) && (
                <motion.span
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
              <span className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/5 transition-colors" />
            </Link>
          ))}
          
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-muted/20 transition-colors"
          >
            <Search size={18} />
          </button>
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-muted/20 transition-colors"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-muted/20 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 py-4 px-6 md:hidden"
          >
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname.startsWith(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-white/80 hover:text-white hover:bg-muted/10"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light text-white">Search the Encyclopedia</h2>
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/80" />
                </button>
              </div>
              <SearchBar onClose={() => setSearchOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
