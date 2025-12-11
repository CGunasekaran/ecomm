import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Import book data
import fiction from "@/data/fiction.json";
import nonFiction from "@/data/non-fiction.json";
import science from "@/data/science.json";
import technology from "@/data/technology.json";
import selfHelp from "@/data/self-help.json";
import { Book } from "@/types";

export const runtime = "edge";

const allBooks: Book[] = [
  ...(fiction as Book[]),
  ...(nonFiction as Book[]),
  ...(science as Book[]),
  ...(technology as Book[]),
  ...(selfHelp as Book[]),
];

const categoryColors: Record<string, { bg: string; accent: string }> = {
  Fiction: { bg: "#4F46E5", accent: "#818CF8" },
  "Non-Fiction": { bg: "#DC2626", accent: "#F87171" },
  Science: { bg: "#059669", accent: "#34D399" },
  Technology: { bg: "#7C3AED", accent: "#A78BFA" },
  "Self-Help": { bg: "#EA580C", accent: "#FB923C" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = allBooks.find((b) => b.id === id);

  if (!book) {
    return new Response("Book not found", { status: 404 });
  }

  const colors = categoryColors[book.category] || categoryColors.Fiction;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.accent} 100%)`,
          fontSize: 32,
          fontWeight: 600,
          position: "relative",
        }}
      >
        {/* Category Badge */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            background: colors.accent,
            color: "white",
            padding: "10px 20px",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          {book.category.toUpperCase()}
        </div>

        {/* Border */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "3px solid rgba(255, 255, 255, 0.3)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {book.title}
          </h1>
        </div>

        {/* Author */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            color: "white",
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          {book.author}
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 100,
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 80,
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        />
      </div>
    ),
    {
      width: 600,
      height: 900,
    }
  );
}
