import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID
} from '@src/config/googleAuth';
import { authService, userService } from '@src/firebase';
import firebase from '@src/firebase/config/firebase.config';
import { useUserStore } from '@store/userStore';
import { fontSize, spacing } from '@styles/spacing';
import { translateAuthError } from '@utils/authErrors';
import { configureGoogleSignin, GoogleSignin, statusCodes } from '@utils/googleSignin';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configure Google Sign-In
configureGoogleSignin({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const colors = useThemeColors();

  /**
   * Main Google Login Handler
   */
  const handleGoogleLoginPress = async () => {
    setIsGoogleLoading(true);

    try {
      // Check for Play Services on Android
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      // Start Google Sign-In flow
      const { data } = await GoogleSignin.signIn();

      if (data?.idToken) {
        console.log('[LoginScreen] Native Google auth success, processing token...');
        await handleFirebaseGoogleLogin(data.idToken);
      } else {
        throw new Error('ID Token não recebido do Google');
      }

    } catch (error: any) {
      console.log('[LoginScreen] Google Sign-In Error:', error.code, error.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('[LoginScreen] Sign-In Cancelado');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('[LoginScreen] Sign-In já em progresso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Erro', 'Google Play Services não disponível');
      } else {
        Alert.alert('Erro no Google', `Falha ao iniciar: ${error.message}`);
      }
      setIsGoogleLoading(false);
    }
  };

  /**
   * Firebase Logic for Google Login
   */
  const handleFirebaseGoogleLogin = async (idToken: string) => {
    setIsGoogleLoading(true);
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

      // Try to sign in with the Google credential
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) throw new Error("Falha na autenticação Google");

      console.log('[LoginScreen] Firebase auth successful for:', firebaseUser.email);
      console.log('[LoginScreen] Provider data:', firebaseUser.providerData.map(p => p?.providerId));
      console.log('[LoginScreen] Is new user:', userCredential.additionalUserInfo?.isNewUser);

      // Get Google photo URL
      const googlePhotoURL = firebaseUser.photoURL || undefined;

      let user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: googlePhotoURL,
      };

      // Check if user profile exists in Firestore
      const existingProfile = await userService.getUserProfile(firebaseUser.uid);

      if (existingProfile) {
        // Existing user - merge profile data
        console.log('[LoginScreen] Existing profile found, merging...');
        user = {
          ...user,
          ...existingProfile,
          // Prefer Google photo if profile doesn't have one
          photoURL: existingProfile.photoURL || googlePhotoURL,
        };

        // Update profile with Google photo if it was missing
        if (!existingProfile.photoURL && googlePhotoURL) {
          await userService.updateUserProfile(firebaseUser.uid, { photoURL: googlePhotoURL });
        }
      } else {
        // New user - create profile
        console.log('[LoginScreen] New user, creating profile...');
        await userService.createUserProfile(user);
      }

      setUser(user);
      console.log('[LoginScreen] Login complete!');

    } catch (error: any) {
      console.error('[LoginScreen] Google Login Error:', error);
      console.error('[LoginScreen] Error code:', error.code);
      console.error('[LoginScreen] Error message:', error.message);

      // Handle specific error cases
      if (error.code === 'auth/account-exists-with-different-credential') {
        // User has an account with email/password, prompt to link
        Alert.alert(
          'Conta Existente',
          'Já existe uma conta com este email. Faça login com email/senha e depois vincule sua conta Google nas Configurações.',
          [{ text: 'OK' }]
        );
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // User cancelled - don't show error
        console.log('[LoginScreen] User cancelled Google auth');
      } else {
        Alert.alert('Erro no Login', translateAuthError(error));
      }
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
              onPress={handleGoogleLoginPress}
              disabled={loading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={colors.text} style={{ marginRight: 8 }} />
                  <Text style={[styles.googleButtonText, { color: colors.text }]}>Entrar com Google</Text>
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
