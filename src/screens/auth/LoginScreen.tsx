import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@store/userStore';
import { authService, userService } from '@src/firebase';
import firebase from '@src/firebase/config/firebase.config';
import { spacing, fontSize } from '@styles/spacing';
import { useThemeColors } from '@hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { translateAuthError } from '@utils/authErrors';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const colors = useThemeColors();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '328256268071-stldq283utksgkddalb8ja0stc84c4gk.apps.googleusercontent.com',
    androidClientId: '328256268071-stldq283utksgkddalb8ja0stc84c4gk.apps.googleusercontent.com', // Using Web ID for Expo Go Proxy
    iosClientId: '328256268071-stldq283utksgkddalb8ja0stc84c4gk.apps.googleusercontent.com', // Using Web ID for Expo Go Proxy
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setIsGoogleLoading(true);
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) throw new Error("Falha na autenticação Google");

      // Basic user info
      let user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      };

      // Fetch or Create Profile
      const profile = await userService.getUserProfile(firebaseUser.uid);
      if (profile) {
        user = { ...user, ...profile };
      } else {
        // New Google User -> Create Profile
        await userService.createUserProfile(user);
      }

      setUser(user);
      // Navigation is automatic via App.tsx but good to ensure
    } catch (error: any) {
      console.error("Google Login Error:", error);
      Alert.alert('Erro no Login', translateAuthError(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
    } catch (error: any) {
      Alert.alert('Erro no Login', translateAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>Agenda Familiar</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Organize suas tarefas compartilhando com sua família e amigos
          </Text>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading && !isGoogleLoading}
            />

            <View style={[styles.passwordContainer, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Senha"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading && !isGoogleLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }, (loading || isGoogleLoading) && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading || isGoogleLoading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>ou</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, { borderColor: colors.border, backgroundColor: colors.background }, (loading || isGoogleLoading) && styles.buttonDisabled]}
              onPress={() => promptAsync()}
              disabled={!request || loading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={styles.googleButtonText}>Entrar com Google</Text>
                </>
              )}
            </TouchableOpacity>

          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Não tem conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading || isGoogleLoading}
            >
              <Text style={[styles.registerLink, { color: colors.primary }]}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (JSX above is mostly fine, we just need to ensure inline styles are covering what we removed)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Dynamic BG
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
    // Dynamic Color
  },
  subtitle: {
    fontSize: fontSize.lg,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    // Dynamic Color
  },
  form: {
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    // Dynamic Border & Color & Placeholder
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    // Dynamic Border
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    // Dynamic Color
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
    // Dynamic BG
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    // Dynamic BG
  },
  dividerText: {
    marginHorizontal: spacing.md,
    // Dynamic Color
  },
  googleButton: {
    borderWidth: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // Dynamic Border & BG
  },
  googleButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    // Dynamic Color
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  footerText: {
    fontSize: fontSize.base,
    // Dynamic Color
  },
  registerLink: {
    fontSize: fontSize.base,
    fontWeight: '600',
    // Dynamic Color
  },
});
