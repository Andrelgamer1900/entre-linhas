import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../styles/globalStyles';
import { ScreenName } from '../types';

interface LoginScreenProps {
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  handleLogin: () => void;
  setCurrentScreen: (screen: ScreenName) => void;
  loading: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  email, setEmail, password, setPassword, handleLogin, setCurrentScreen, loading 
}) => (
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
