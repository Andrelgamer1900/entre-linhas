import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../styles/globalStyles';
import { ScreenName } from '../types';

interface SignupScreenProps {
  name: string;
  setName: (text: string) => void;
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  handleSignup: () => void;
  setCurrentScreen: (screen: ScreenName) => void;
  loading: boolean;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ 
  name, setName, email, setEmail, password, setPassword, handleSignup, setCurrentScreen, loading 
}) => (
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
