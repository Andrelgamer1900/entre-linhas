import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, TextInput, StyleSheet, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';


// --- TIPAGENS (TypeScript) ---
interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail: string };
  };
}

type ScreenName = 'Login' | 'Signup' | 'Home';

interface User {
  email: string;
  name?: string;
}

// --- CONFIGURAÇÃO ---
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// --- COMPONENTES ---

const LoginScreen: React.FC<{
  email: string; setEmail: (t: string) => void;
  password: string; setPassword: (t: string) => void;
  handleLogin: () => void; setCurrentScreen: (s: ScreenName) => void;
  loading: boolean;
}> = ({ email, setEmail, password, setPassword, handleLogin, setCurrentScreen, loading }) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
    <View style={styles.authCard}>
      <Text style={styles.authTitle}>Entre Linhas</Text>
      <Text style={styles.authSubtitle}>Sua jornada literária começa aqui</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentScreen('Signup')}>
        <Text style={styles.linkText}>Novo por aqui? <Text style={styles.linkBold}>Crie uma conta</Text></Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);

const SignupScreen: React.FC<{
  name: string; setName: (t: string) => void;
  email: string; setEmail: (t: string) => void;
  password: string; setPassword: (t: string) => void;
  handleSignup: () => void; setCurrentScreen: (s: ScreenName) => void;
  loading: boolean;
}> = ({ name, setName, email, setEmail, password, setPassword, handleSignup, setCurrentScreen, loading }) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.authContainer}>
    <View style={styles.authCard}>
      <Text style={styles.authTitle}>Cadastro</Text>
      <Text style={styles.authSubtitle}>Crie sua conta gratuita</Text>
      <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CADASTRAR</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
        <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkBold}>Voltar para Login</Text></Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);

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
    if (currentScreen === 'Home') loadInitialBooks();
  }, [currentScreen]);

  const loadInitialBooks = async () => {
    setLoading(true); setError(false);
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=newest&maxResults=20`);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (e) { setError(true); }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return loadInitialBooks();
    setLoading(true); setError(false);
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(search)}&maxResults=30`);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (e) { setError(true); }
    setLoading(false);
  };

  const handleLogin = () => {
    if (email.includes('@') && password.length >= 6) {
      setUser({ email, name: name || email.split('@')[0] });
      setCurrentScreen('Home');
    } else {
      Alert.alert("Erro", "Dados inválidos.");
    }
  };

  const handleSignup = () => {
    if (email.includes('@') && password.length >= 6 && name.length > 2) {
      Alert.alert("Sucesso!", "Conta criada.");
      setCurrentScreen('Login');
    } else {
      Alert.alert("Erro", "Preencha corretamente.");
    }
  };

  if (currentScreen === 'Login') return <LoginScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} setCurrentScreen={setCurrentScreen} loading={loading} />;
  if (currentScreen === 'Signup') return <SignupScreen name={name} setName={setName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSignup={handleSignup} setCurrentScreen={setCurrentScreen} loading={loading} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Entre Linhas</Text>
          <TouchableOpacity onPress={() => {setCurrentScreen('Login'); setBooks([]);}}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Bem-vindo, {user?.name}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchBar} placeholder="Pesquisar livros..." value={search} onChangeText={setSearch} onSubmitEditing={handleSearch} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#3182CE" /><Text>Buscando...</Text></View>
      ) : error ? (
        <View style={styles.center}><Text>Erro ao carregar.</Text><TouchableOpacity onPress={loadInitialBooks}><Text style={{color: '#3182CE'}}>Tentar de novo</Text></TouchableOpacity></View>
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
            <TouchableOpacity onPress={() => setSelectedBook(null)}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
            <ScrollView>
              {selectedBook && (
                <>
                  <Image source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedBook.volumeInfo.title}</Text>
                  <Text style={styles.modalDescription}>{selectedBook.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || 'Sem descrição.'}</Text>
                  <TouchableOpacity style={styles.readButton} onPress={() => setSelectedBook(null)}><Text style={styles.readButtonText}>FECHAR</Text></TouchableOpacity>
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
  authContainer: { flex: 1, backgroundColor: '#1A365D', justifyContent: 'center', padding: 20 },
  authCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#1A365D', textAlign: 'center' },
  authSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 10 },
  primaryButton: { backgroundColor: '#3182CE', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 15, color: '#718096' },
  linkBold: { color: '#3182CE', fontWeight: 'bold' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A365D' },
  logoutText: { color: '#E53E3E', fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, color: '#4A5568' },
  searchContainer: { padding: 10 },
  searchBar: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E0' },
  listContent: { padding: 10 },
  bookCard: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 10, flexDirection: 'row', padding: 10, elevation: 2 },
  bookImage: { width: 70, height: 105, borderRadius: 8 },
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold' },
  bookAuthor: { fontSize: 12, color: '#718096' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '80%' },
  closeButtonText: { fontSize: 24, color: '#A0AEC0', alignSelf: 'flex-end' },
  modalImage: { width: 100, height: 150, borderRadius: 8, alignSelf: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  modalDescription: { fontSize: 14, color: '#4A5568', marginTop: 15, textAlign: 'justify' },
  readButton: { backgroundColor: '#3182CE', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  readButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});
