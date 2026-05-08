import React from 'react';
import { 
  View, Text, FlatList, Image, TextInput, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, StatusBar, Modal, ScrollView 
} from 'react-native';
import { styles } from '../styles/globalStyles';
import { Book, User, ScreenName } from '../types';

interface LibraryScreenProps {
  user: User | null;
  books: Book[];
  search: string;
  setSearch: (text: string) => void;
  loading: boolean;
  error: boolean;
  loadInitialBooks: () => void;
  handleSearch: () => void;
  setSelectedBook: (book: Book | null) => void;
  selectedBook: Book | null;
  setCurrentScreen: (screen: ScreenName) => void;
  setUser: (user: User | null) => void;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  setBooks: (books: Book[]) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  user, books, search, setSearch, loading, error, loadInitialBooks, 
  handleSearch, setSelectedBook, selectedBook, setCurrentScreen, 
  setUser, setEmail, setPassword, setBooks
}) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Entre Linhas</Text>
        <TouchableOpacity onPress={() => {setUser(null); setCurrentScreen('Login'); setEmail(''); setPassword(''); setBooks([]);}}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerSubtitle}>Bem-vindo, {user?.name || user?.email.split('@')[0]}</Text>
    </View>

    <View style={styles.searchContainer}>
      <TextInput 
        style={styles.searchBar} 
        placeholder="Pesquisar livros ou autores..." 
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        placeholderTextColor="#A0AEC0"
      />
    </View>

    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3182CE" />
        <Text style={styles.loadingText}>Buscando livros...</Text>
      </View>
    ) : error ? (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ops! Não conseguimos carregar os livros.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInitialBooks}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <FlatList 
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookCard} onPress={() => setSelectedBook(item)}>
            <Image 
              source={{ uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} 
              style={styles.bookImage} 
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
              <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ') || 'Autor Desconhecido'}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>E-book</Text></View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro encontrado.</Text>}
      />
    )}

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
                <TouchableOpacity style={styles.readButton} onPress={() => setSelectedBook(null)}>
                  <Text style={styles.readButtonText}>LER AGORA</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);
