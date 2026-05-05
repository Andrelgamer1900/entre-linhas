import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, StyleSheet, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import axios from 'axios';

// --- CONFIGURAÇÃO DO FIREBASE (André, peça para ela as chaves e cole aqui) ---
// Se não tiver as chaves agora, o app vai mostrar as telas, mas o login real não funcionará.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// --- CONFIGURAÇÃO GOOGLE BOOKS ---
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login'); // 'Login', 'Signup', 'Home'
  const [user, setUser] = useState(null);
  
  // Estados da Biblioteca
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Estados de Auth
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

  const handleLogin = () => {
    // Simulação de Login (Já que não temos as chaves reais agora)
    if (email && password) {
      setUser({ email });
      setCurrentScreen('Home');
    } else {
      Alert.alert("Erro", "Preencha e-mail e senha.");
    }
  };

  const handleSignup = () => {
    if (email && password && name) {
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      setCurrentScreen('Login');
    } else {
      Alert.alert("Erro", "Preencha todos os campos.");
    }
  };

  // --- COMPONENTES DE TELA ---

  const LoginScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Entre Linhas</Text>
        <Text style={styles.authSubtitle}>Bem-vindo de volta!</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="E-mail" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('Signup')}>
          <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const SignupScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Criar Conta</Text>
        <Text style={styles.authSubtitle}>Junte-se à nossa comunidade</Text>
        
        <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
          <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const LibraryScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Entre Linhas</Text>
          <TouchableOpacity onPress={() => {setUser(null); setCurrentScreen('Login');}}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Olá, {user?.email.split('@')[0]}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Pesquisar livros..." 
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3182CE" />
        </View>
      ) : (
        <FlatList 
          data={books}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookCard} onPress={() => setSelectedBook(item)}>
              <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
                <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ')}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={!!selectedBook} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedBook(null)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView>
              {selectedBook && (
                <>
                  <Image source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedBook.volumeInfo.title}</Text>
                  <Text style={styles.modalDescription}>{selectedBook.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || 'Sem descrição.'}</Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  // --- NAVEGAÇÃO SIMPLES ---
  if (currentScreen === 'Login') return <LoginScreen />;
  if (currentScreen === 'Signup') return <SignupScreen />;
  return <LibraryScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  authContainer: { flex: 1, backgroundColor: '#1A365D', justifyContent: 'center', padding: 20 },
  authCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30, elevation: 10 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: 10 },
  authSubtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  primaryButton: { backgroundColor: '#3182CE', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 20, color: '#718096' },
  linkBold: { color: '#3182CE', fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A365D' },
  logoutText: { color: '#E53E3E', fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, color: '#718096', marginTop: 4 },
  searchContainer: { padding: 15 },
  searchBar: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E0' },
  listContent: { padding: 15 },
  bookCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 15, flexDirection: 'row', padding: 10, elevation: 3 },
  bookImage: { width: 80, height: 120, borderRadius: 6 },
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  bookAuthor: { fontSize: 13, color: '#718096', marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, height: '80%' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeButtonText: { fontSize: 24, color: '#A0AEC0' },
  modalImage: { width: 120, height: 180, borderRadius: 8, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: 15 },
  modalDescription: { fontSize: 15, color: '#4A5568', lineHeight: 22, textAlign: 'justify' }
});
