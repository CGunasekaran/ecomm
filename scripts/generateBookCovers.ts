import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

// Book data type
interface BookData {
  id: string;
  title: string;
  author: string;
  category: string;
}

// Color schemes for different categories
const categoryColors: Record<string, { bg: string; accent: string; text: string }> = {
  Fiction: { bg: '#4F46E5', accent: '#818CF8', text: '#FFFFFF' },
  'Non-Fiction': { bg: '#DC2626', accent: '#F87171', text: '#FFFFFF' },
  Science: { bg: '#059669', accent: '#34D399', text: '#FFFFFF' },
  Technology: { bg: '#7C3AED', accent: '#A78BFA', text: '#FFFFFF' },
  'Self-Help': { bg: '#EA580C', accent: '#FB923C', text: '#FFFFFF' },
};

// Gradient patterns
const gradientPatterns = [
  'linear',
  'radial',
  'diagonal',
  'geometric',
];

/**
 * Wrap text to fit within a specified width
 */
function wrapText(
  ctx: any,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Draw gradient background
 */
function drawGradientBackground(
  ctx: any,
  width: number,
  height: number,
  colors: { bg: string; accent: string }
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.bg);
  gradient.addColorStop(1, colors.accent);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw decorative elements
 */
function drawDecorativeElements(
  ctx: any,
  width: number,
  height: number,
  category: string
) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;

  // Draw circles
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 50 + 20;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Generate a book cover image
 */
export function generateBookCover(
  book: BookData,
  outputPath: string,
  width: number = 600,
  height: number = 900
) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Get category colors
  const colors = categoryColors[book.category] || categoryColors.Fiction;

  // Draw background
  drawGradientBackground(ctx, width, height, colors);

  // Draw decorative elements
  drawDecorativeElements(ctx, width, height, book.category);

  // Add subtle texture
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();

  // Draw category badge
  ctx.fillStyle = colors.accent;
  ctx.fillRect(30, 30, 150, 40);
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(book.category.toUpperCase(), 105, 55);

  // Draw title
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  
  const titleLines = wrapText(ctx, book.title, width - 100, 60);
  const titleStartY = height / 2 - (titleLines.length * 60) / 2;
  
  titleLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, titleStartY + index * 60);
  });

  // Draw author
  ctx.font = '28px Arial';
  ctx.fillStyle = colors.text;
  ctx.globalAlpha = 0.9;
  ctx.fillText(book.author, width / 2, height - 100);

  // Add border
  ctx.strokeStyle = colors.text;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

/**
 * Generate covers for all books in a category
 */
export function generateCoversForCategory(
  categoryFile: string,
  outputDir: string
) {
  const books = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  books.forEach((book: BookData) => {
    const filename = `${book.id}.png`;
    const outputPath = path.join(outputDir, filename);
    
    console.log(`Generating cover for: ${book.title}`);
    generateBookCover(book, outputPath);
  });
}

/**
 * Generate all book covers
 */
export function generateAllCovers() {
  const categories = ['fiction', 'non-fiction', 'science', 'technology', 'self-help'];
  const dataDir = path.join(process.cwd(), 'data');
  const outputDir = path.join(process.cwd(), 'public', 'images', 'books');

  categories.forEach((category) => {
    console.log(`\nGenerating covers for ${category}...`);
    const categoryFile = path.join(dataDir, `${category}.json`);
    generateCoversForCategory(categoryFile, outputDir);
  });

  console.log('\n✅ All book covers generated successfully!');
}

// Run if executed directly
if (require.main === module) {
  generateAllCovers();
}
