"use client";

interface Book {
  title: string;
  author?: string;
  tribe?: string;
}

interface BookRowProps {
  books: Book[];
  c1: string;
  c2: string;
  label: string;
}

export default function BookRow({ books, c1, c2, label }: BookRowProps) {
  if (!books || books.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="text-muted-2 text-xs font-medium mb-2.5">{label}</p>
      <div
        className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1.5"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {books.map((book, i) => (
          <div
            key={i}
            className="relative rounded-xl flex flex-col justify-between shrink-0 overflow-hidden"
            style={{
              scrollSnapAlign: "start",
              minWidth: 120,
              maxWidth: 120,
              minHeight: 130,
              background: `linear-gradient(155deg, ${c1}18, ${c1}08)`,
              border: `1px solid ${c1}15`,
              padding: "14px 10px",
            }}
          >
            {/* Spine accent */}
            <div
              className="absolute left-0 top-0 bottom-0 rounded-l-xl"
              style={{
                width: 3,
                background: `linear-gradient(to bottom, ${c1}40, ${c2}20)`,
              }}
            />
            <p
              className="font-display text-xs font-semibold leading-snug pl-1.5"
              style={{ color: "#E8E2D8" }}
            >
              {book.title}
            </p>
            <div className="pl-1.5">
              {book.author && (
                <p
                  className="text-[10px] italic mt-1.5"
                  style={{ color: "#7A756D" }}
                >
                  {book.author}
                </p>
              )}
              {book.tribe && (
                <p className="text-[8px] mt-1" style={{ color: "#5A564F" }}>
                  {book.tribe}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {books.length > 3 && (
        <p
          className="text-[10px] italic text-right mt-1"
          style={{ color: "#4A463F" }}
        >
          Swipe to see more
        </p>
      )}
    </div>
  );
}
