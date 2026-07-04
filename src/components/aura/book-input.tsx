"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface BookInputProps {
  onSubmit: (books: string[]) => void;
  loading: boolean;
  initialBooks?: string[];
}

interface Suggestion {
  title: string;
  author: string;
}

export default function BookInput({ onSubmit, loading, initialBooks = [] }: BookInputProps) {
  const [books, setBooks] = useState<string[]>(initialBooks);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    const trimmed = input.trim();
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (trimmed.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { results: Suggestion[] };
        setSuggestions(data.results ?? []);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch {
        // ignore aborted/failed requests
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addBookByTitle(title: string) {
    const trimmed = title.trim();
    if (!trimmed || books.length >= 7) return;
    if (books.some((b) => b.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setBooks([...books, trimmed]);
    skipNextFetch.current = true;
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function addBook() {
    addBookByTitle(input);
  }

  function removeBook(index: number) {
    setBooks(books.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
        return;
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        addBookByTitle(suggestions[activeIndex].title);
      } else {
        addBook();
      }
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-fadeInUp">
      <h2 className="font-display text-2xl font-bold text-center mb-2">
        What are your favorite books?
      </h2>
      <p className="text-muted-1 text-sm text-center mb-8">
        Enter 3-7 books that define your reading taste
      </p>

      {/* Input */}
      <div ref={containerRef} className="relative mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="Type a book title..."
            disabled={books.length >= 7 || loading}
            autoComplete="off"
            className="flex-1 bg-muted-6/50 border border-muted-5 rounded-xl px-4 py-3 text-text placeholder:text-muted-2 focus:outline-none focus:border-accent/50 transition-colors text-sm"
          />
          <button
            onClick={addBook}
            disabled={!input.trim() || books.length >= 7 || loading}
            className="w-11 h-11 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-xl font-bold disabled:opacity-30 transition-opacity shrink-0"
          >
            +
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && books.length < 7 && (
          <ul className="absolute z-20 left-0 right-0 mt-2 bg-muted-6 border border-muted-5 rounded-xl overflow-hidden shadow-xl max-h-72 overflow-y-auto no-scrollbar">
            {suggestions.map((s, i) => (
              <li key={`${s.title}-${i}`}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); addBookByTitle(s.title); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full text-left px-4 py-2.5 transition-colors ${
                    i === activeIndex ? "bg-accent/15" : "hover:bg-muted-5/40"
                  }`}
                >
                  <span className="block text-sm text-text truncate">{s.title}</span>
                  {s.author && (
                    <span className="block text-xs text-muted-2 italic truncate">{s.author}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Book pills */}
      {books.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {books.map((book, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-muted-5/40 border border-muted-4/50 rounded-full px-3 py-1.5 text-sm text-text-secondary animate-popIn"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {book}
              <button
                onClick={() => removeBook(i)}
                className="text-muted-2 hover:text-error transition-colors ml-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-muted-2 text-xs text-center mb-4">
        {books.length}/7 books
        {books.length < 3 && ` — add ${3 - books.length} more to continue`}
      </p>

      {/* Submit */}
      {books.length >= 3 && (
        <button
          onClick={() => onSubmit(books)}
          disabled={loading}
          className="btn-primary w-full animate-fadeInUp"
        >
          {loading ? "Generating..." : "Reveal My Reading Aura"}
        </button>
      )}
    </div>
  );
}
