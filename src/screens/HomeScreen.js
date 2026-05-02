import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFeaturedBooks, searchBooks } from '../services/googleBooks';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialBooks();
  }, []);

  const loadInitialBooks = async () => {
    setLoading(true);
    const data = await getFeaturedBooks();
    setBooks(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (search.trim() === '') {
      loadInitialBooks();
      return;
    }
    setLoading(true);
    const data = await searchBooks(search);
    setBooks(data);
    setLoading(false);
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookCard}>
      <Image 
        source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }} 
        style={styles.bookImage} 
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ') || 'Autor desconhecido'}</Text>
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonText}>Ler Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Biblioteca</Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.searchBar} 
        placeholder="Buscar livros no Google Books..." 
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3182CE" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={books}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A365D' },
  logoutText: { color: '#E53E3E', fontWeight: '600' },
  searchBar: { margin: 15, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  listContent: { padding: 15 },
  bookCard: { backgroundColor: '#FFFFFF', borderRadius: 15, marginBottom: 15, flexDirection: 'row', padding: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bookImage: { width: 90, height: 130, borderRadius: 8 },
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  bookAuthor: { fontSize: 14, color: '#718096' },
  readButton: { backgroundColor: '#3182CE', padding: 8, borderRadius: 5, alignItems: 'center' },
  readButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});
