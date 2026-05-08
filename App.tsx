import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { fetchInitialBooks, searchBooks } from './src/services/googleBooks';
import { Book, User, ScreenName } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (currentScreen === 'Home') {
      loadInitialBooks();
    }
  }, [currentScreen]);

  const loadInitialBooks = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchInitialBooks();
      setBooks(data);
    } catch (e) { 
      setError(true);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (search.trim() === '') {
      loadInitialBooks();
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const data = await searchBooks(search);
      setBooks(data);
    } catch (e) { 
      setError(true);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    if (email.includes('@') && password.length >= 6) {
      setLoading(true);
      setTimeout(() => {
        setUser({ email, name: name || email.split('@')[0] });
        setCurrentScreen('Home');
        setLoading(false);
      }, 800);
    } else {
      Alert.alert("Erro", "E-mail inválido ou senha curta.");
    }
  };

  const handleSignup = () => {
    if (email.includes('@') && password.length >= 6 && name.length > 2) {
      setLoading(true);
      setTimeout(() => {
        Alert.alert("Sucesso!", "Conta criada.");
        setCurrentScreen('Login');
        setLoading(false);
      }, 800);
    } else {
      Alert.alert("Erro", "Preencha os campos corretamente.");
    }
  };

  if (currentScreen === 'Login') {
    return (
      <LoginScreen 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleLogin={handleLogin} 
        setCurrentScreen={setCurrentScreen} 
        loading={loading} 
      />
    );
  }

  if (currentScreen === 'Signup') {
    return (
      <SignupScreen 
        name={name} 
        setName={setName} 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleSignup={handleSignup} 
        setCurrentScreen={setCurrentScreen} 
        loading={loading} 
      />
    );
  }

  return (
    <LibraryScreen 
      user={user}
      books={books}
      search={search}
      setSearch={setSearch}
      loading={loading}
      error={error}
      loadInitialBooks={loadInitialBooks}
      handleSearch={handleSearch}
      setSelectedBook={setSelectedBook}
      selectedBook={selectedBook}
      setCurrentScreen={setCurrentScreen}
      setUser={setUser}
      setEmail={setEmail}
      setPassword={setPassword}
      setBooks={setBooks}
    />
  );
}
