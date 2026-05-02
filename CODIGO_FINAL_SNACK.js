import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, StyleSheet, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar,
  Modal, ScrollView
} from 'react-native';
import axios from 'axios';

// --- CONFIGURAÇÃO ---
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    loadInitialBooks();
  }, []);

  const loadInitialBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=newest&maxResults=15`);
      setBooks(response.data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (search.trim() === '') {
      loadInitialBooks();
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API}?q=${search}&maxResults=20`);
      setBooks(response.data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.bookCard} onPress={() => setSelectedBook(item)}>
      <Image 
        source={{ uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} 
        style={styles.bookImage} 
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ') || 'Autor desconhecido'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Disponível</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Entre Linhas</Text>
        <Text style={styles.headerSubtitle}>Sua Biblioteca Digital</Text>
      </View>

      {/* BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Pesquisar por título ou autor..." 
          placeholderTextColor="#A0AEC0"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* LISTA DE LIVROS */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3182CE" />
          <Text style={styles.loadingText}>Buscando livros...</Text>
        </View>
      ) : (
        <FlatList 
          data={books}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* MODAL DE DETALHES */}
      <Modal visible={!!selectedBook} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedBook(null)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBook && (
                <>
                  <Image 
                    source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} 
                    style={styles.modalImage} 
                  />
                  <Text style={styles.modalTitle}>{selectedBook.volumeInfo.title}</Text>
                  <Text style={styles.modalAuthor}>{selectedBook.volumeInfo.authors?.join(', ')}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedBook.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || 'Sem descrição disponível.'}
                  </Text>
                  <TouchableOpacity style={styles.readNowButton} onPress={() => setSelectedBook(null)}>
                    <Text style={styles.readNowText}>COMEÇAR LEITURA</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A365D', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 4 },
  searchContainer: { padding: 15 },
  searchBar: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E0', fontSize: 16, color: '#2D3748' },
  listContent: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#4A5568' },
  bookCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, flexDirection: 'row', padding: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bookImage: { width: 100, height: 150, borderRadius: 8 },
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginBottom: 4 },
  bookAuthor: { fontSize: 14, color: '#718096', marginBottom: 10 },
  badge: { backgroundColor: '#EBF8FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeText: { color: '#3182CE', fontSize: 12, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, height: '85%' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeButtonText: { fontSize: 24, color: '#A0AEC0' },
  modalImage: { width: 150, height: 220, borderRadius: 12, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: 8 },
  modalAuthor: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 20 },
  modalDescription: { fontSize: 16, color: '#4A5568', lineHeight: 24, textAlign: 'justify', marginBottom: 30 },
  readNowButton: { backgroundColor: '#3182CE', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  readNowText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
