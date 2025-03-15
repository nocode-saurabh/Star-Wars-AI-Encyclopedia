
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchAcrossAll } from "@/services/api";

interface SearchResult {
  id: string;
  name: string | null;
  title?: string;
  category: string;
  url: string;
}

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus on input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchAcrossAll(query);
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchItems, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    // Enter
    else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleResultClick(selected);
      }
    }
    // Escape
    else if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const id = result.url.split("/").filter(Boolean).pop();
    const path = `/category/${result.category}/${id}`;
    navigate(path);
    onClose?.();
  };

  const highlightMatch = (text: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-primary/20 text-primary font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-muted-foreground/60 animate-spin" />
          ) : (
            <Search size={18} className="text-muted-foreground/60" />
          )}
        </div>
        <input
          ref={inputRef}
          type="search"
          className="block w-full pl-10 pr-3 py-4 bg-card/40 border border-white/10 rounded-lg text-base placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Search characters, planets, films..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {query.trim().length > 0 && (
        <div className="mt-3 bg-card/50 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden animate-fade-in shadow-xl">
          {results.length > 0 ? (
            <ul className="max-h-[60vh] overflow-auto py-2 divide-y divide-white/5">
              {results.map((result, index) => (
                <li
                  key={`${result.category}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-colors flex flex-col",
                    index === selectedIndex ? "bg-primary/10" : "hover:bg-white/5"
                  )}
                >
                  <span className="font-medium">
                    {highlightMatch(result.name || result.title || "Unknown")}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1 capitalize">
                    {result.category}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {isLoading ? "Searching..." : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
