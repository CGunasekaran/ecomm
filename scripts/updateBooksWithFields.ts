import fs from 'fs';
import path from 'path';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  [key: string]: any;
}

const formats = ['Hardcover', 'Paperback', 'Kindle', 'Audiobook'];
const languages = ['English', 'Spanish', 'French', 'German'];

function getRandomFormats(): string[] {
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 formats
  const shuffled = [...formats].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDimensions() {
  return {
    length: +(Math.random() * 3 + 7).toFixed(1),
    width: +(Math.random() * 2 + 5).toFixed(1),
    height: +(Math.random() * 1 + 0.8).toFixed(1),
    unit: 'inches' as const,
  };
}

function updateBook(book: Book): Book {
  const bookFormats = getRandomFormats();
  
  return {
    ...book,
    image: `/api/book-cover/${book.id}`,
    language: 'English',
    format: bookFormats,
    dimensions: getRandomDimensions(),
    weight: `${(Math.random() * 1.5 + 0.5).toFixed(1)} pounds`,
    edition: Math.random() > 0.5 ? '1st Edition' : 'Reprint Edition',
    ageRange: 'Adult',
    publicationCountry: 'United States',
    ...(bookFormats.includes('Audiobook') && {
      audioLength: `${Math.floor(Math.random() * 10 + 5)} hours and ${Math.floor(Math.random() * 59)} minutes`,
      narrator: ['Narrator Name', 'John Doe', 'Jane Smith'][Math.floor(Math.random() * 3)],
    }),
  };
}

function updateCategoryFile(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename);
  const books: Book[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const updatedBooks = books.map(updateBook);
  
  fs.writeFileSync(filePath, JSON.stringify(updatedBooks, null, 2));
  console.log(`✅ Updated ${filename}`);
}

function updateAllFiles() {
  const categories = ['fiction.json', 'non-fiction.json', 'science.json', 'technology.json', 'self-help.json'];
  
  categories.forEach(updateCategoryFile);
  
  console.log('\n✅ All files updated successfully!');
}

// Run
updateAllFiles();
