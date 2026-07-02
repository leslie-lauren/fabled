"use client";

import { useState, KeyboardEvent } from "react";

interface BookInputProps {
  onSubmit: (books: string[]) => void;
  loading: boolean;
  initialBooks?: string[];
}

export default function BookInput({ onSubmit, loading, initialBooks = [] }: BookInputProps) {
  const [books, setBooks] = useState<string[]>(initialBooks);
  const [input, setInput] = useState("");

  function addBook() {
    const trimmed = input.trim();
    if (!trimmed || books.length >= 7) return;
    if (books.some((b) => b.toLowerCase() === trimmed.toLowerCase())) return;
    setBooks([...books, trimmed]);
    setInput("");
  }

  function removeBook(index: number) {
    setBooks(books.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addBook();
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
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a book title..."
          disabled={books.length >= 7 || loading}
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
