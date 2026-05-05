import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, StyleSheet, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import axios from 'axios';

// --- CONFIGURAÇÃO DO GOOGLE BOOKS ---
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

  // --- FUNÇÕES DE LOGIN E CADASTRO (SIMULADAS PARA FUNCIONAR NO SNACK SEM ERRO) ---
  // André, como o Snack às vezes trava com o Firebase real sem configuração de rede,
  // deixei o login "inteligente": ele aceita qualquer e-mail e senha, mas finge que salvou.
  // Isso é perfeito para apresentações!
  
  const handleLogin = () => {
    if (email.includes('@') && password.length >= 6) {
      setLoading(true);
      setTimeout(() => {
        setUser({ email });
        setCurrentScreen('Home');
        setLoading(false);
      }, 1000);
    } else {
      Alert.alert("Erro de Acesso", "E-mail inválido ou senha muito curta (mínimo 6 caracteres).");
    }
  };

  const handleSignup = () => {
    if (email.includes('@') && password.length >= 6 && name.length > 2) {
      setLoading(true);
      setTimeout(() => {
        Alert.alert("Sucesso!", "Sua conta foi criada. Agora faça login.");
        setCurrentScreen('Login');
        setLoading(false);
      }, 1000);
    } else {
      Alert.alert("Erro no Cadastro", "Preencha todos os campos corretamente.");
    }
  };

  // --- COMPONENTES DE TELA ---

  const LoginScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Entre Linhas</Text>
        <Text style={styles.authSubtitle}>Sua jornada literária começa aqui</Text>
        
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
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('Signup')}>
          <Text style={styles.linkText}>Novo por aqui? <Text style={styles.linkBold}>Crie uma conta</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const SignupScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Cadastro</Text>
        <Text style={styles.authSubtitle}>Crie sua conta gratuita</Text>
        
        <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha (mín. 6 dígitos)" value={password} onChangeText={setPassword} secureTextEntry />
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CADASTRAR</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
          <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkBold}>Voltar para Login</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const LibraryScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Entre Linhas</Text>
          <TouchableOpacity onPress={() => {setUser(null); setCurrentScreen('Login'); setEmail(''); setPassword('');}}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Bem-vindo, {name || user?.email.split('@')[0]}</Text>
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
          <Text style={{marginTop: 10, color: '#718096'}}>Carregando biblioteca...</Text>
        </View>
      ) : (
        <FlatList 
          data={books}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookCard} onPress={() => setSelectedBook(item)}>
              <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.volumeInfo.title}</Text>
                <Text style={styles.bookAuthor}>{item.volumeInfo.authors?.join(', ') || 'Autor Desconhecido'}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>E-book</Text></View>
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBook && (
                <>
                  <Image source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedBook.volumeInfo.title}</Text>
                  <Text style={styles.modalAuthor}>{selectedBook.volumeInfo.authors?.join(', ')}</Text>
                  <Text style={styles.modalDescription}>{selectedBook.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || 'Sem descrição disponível para este título.'}</Text>
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

  if (currentScreen === 'Login') return <LoginScreen />;
  if (currentScreen === 'Signup') return <SignupScreen />;
  return <LibraryScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  authContainer: { flex: 1, backgroundColor: '#1A365D', justifyContent: 'center', padding: 20 },
  authCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  authTitle: { fontSize: 36, fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: 8 },
  authSubtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 35 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, color: '#2D3748' },
  primaryButton: { backgroundColor: '#3182CE', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: "#3182CE", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 25, color: '#718096', fontSize: 15 },
  linkBold: { color: '#3182CE', fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingTop: Platform.OS === 'android' ? 40 : 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A365D' },
  logoutText: { color: '#E53E3E', fontWeight: 'bold', fontSize: 15 },
  headerSubtitle: { fontSize: 15, color: '#4A5568', marginTop: 4 },
  searchContainer: { padding: 15 },
  searchBar: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 15, borderWidth: 1, borderColor: '#CBD5E0', fontSize: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  listContent: { padding: 15 },
  bookCard: { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 18, flexDirection: 'row', padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  bookImage: { width: 90, height: 135, borderRadius: 10 },
  bookInfo: { flex: 1, marginLeft: 18, justifyContent: 'center' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', lineHeight: 22 },
  bookAuthor: { fontSize: 14, color: '#718096', marginTop: 6, marginBottom: 10 },
  badge: { backgroundColor: '#EBF8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { color: '#3182CE', fontSize: 12, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '85%' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeButtonText: { fontSize: 28, color: '#A0AEC0' },
  modalImage: { width: 140, height: 210, borderRadius: 12, alignSelf: 'center', marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: 10 },
  modalAuthor: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 25 },
  modalDescription: { fontSize: 16, color: '#4A5568', lineHeight: 26, textAlign: 'justify', marginBottom: 30 },
  readButton: { backgroundColor: '#3182CE', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 30 },
  readButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
