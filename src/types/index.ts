export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export type ScreenName = 'Login' | 'Signup' | 'Home';

export interface User {
  email: string;
  name?: string;
}
