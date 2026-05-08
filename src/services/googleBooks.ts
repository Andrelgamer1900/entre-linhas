import { Book } from '../types';

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export const fetchInitialBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=newest&maxResults=20`);
    if (!response.ok) throw new Error("Erro na API");
    const data = await response.json();
    return data.items || [];
  } catch (e) {
    console.error("Erro ao carregar livros:", e);
    throw e;
  }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=30`);
    if (!response.ok) throw new Error("Erro na busca");
    const data = await response.json();
    return data.items || [];
  } catch (e) {
    console.error("Erro na busca:", e);
    throw e;
  }
};
