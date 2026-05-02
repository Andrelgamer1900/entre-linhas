import axios from 'axios';

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export const searchBooks = async (query) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API}?q=${query}&maxResults=10`);
    return response.data.items || [];
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    return [];
  }
};

export const getFeaturedBooks = async () => {
  try {
    // Busca alguns livros clássicos para a tela inicial
    const response = await axios.get(`${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=newest&maxResults=10`);
    return response.data.items || [];
  } catch (error) {
    console.error("Erro ao buscar livros em destaque:", error);
    return [];
  }
};
