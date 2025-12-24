import PickerModal from '@components/PickerModal';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID
} from '@src/config/googleAuth';
import { authService, familyService, userService } from '@src/firebase';
import firebase from '@src/firebase/config/firebase.config';
import { useUserStore } from '@store/userStore';
import { fontSize, fontWeight, spacing } from '@styles/spacing';
import type { Family } from '@types';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user, preferences, setPreferences, logout, setUser } = useUserStore();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  // Check if Google provider is linked to the current user
  useEffect(() => {
    const checkGoogleLinked = () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const hasGoogle = currentUser.providerData.some(
          (provider) => provider?.providerId === 'google.com'
        );
        setIsGoogleLinked(hasGoogle);
      }
    };
    checkGoogleLinked();
  }, [user]);

  useEffect(() => {
    const fetchFamily = async () => {
      if (user?.familyId) {
        const fetchedFamily = await familyService.getFamilyDetails(user.familyId);
        setFamily(fetchedFamily);
      }
    };
    fetchFamily();
  }, [user?.familyId]);

  const copyToClipboard = async () => {
    if (family?.code) {
      await Clipboard.setStringAsync(family.code);
      Alert.alert('Sucesso', 'Código copiado para a área de transferência!');
    }
  };

  // Create proper redirect URI
  const redirectUri = makeRedirectUri({
    scheme: 'agendafamiliar',
    path: 'auth',
    preferLocalhost: false,
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLink(id_token);
    }
  }, [response]);

  const handleGoogleLink = async (idToken: string) => {
    if (!user) return;
    setIsLinking(true);
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) throw new Error("No authenticated user");

      // Link the Google credential to the existing account
      await currentUser.linkWithCredential(credential);

      // Current User should now have providerData including google.
      const googleProvider = currentUser.providerData.find(p => p?.providerId === 'google.com');

      if (googleProvider?.photoURL) {
        const updatedUser = { ...user, photoURL: googleProvider.photoURL };
        await userService.createUserProfile(updatedUser); // persist
        setUser(updatedUser); // Update local store
      }

      // Mark Google as linked
      setIsGoogleLinked(true);

      Alert.alert('Sucesso', 'Conta Google vinculada com sucesso! Agora você pode fazer login com email/senha ou com Google.');

    } catch (error: any) {
      console.error("Link error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      if (error.code === 'auth/credential-already-in-use') {
        Alert.alert('Erro', 'Esta conta Google já está vinculada a outro usuário.');
      } else if (error.code === 'auth/provider-already-linked') {
        Alert.alert('Info', 'Esta conta Google já está vinculada à sua conta.');
        setIsGoogleLinked(true);
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'O email desta conta Google já está em uso por outro usuário.');
      } else {
        Alert.alert('Erro', `Falha ao vincular conta Google: ${error.message || 'Erro desconhecido'}`);
      }
    } finally {
      setIsLinking(false);
    }
  };

  const themeOptions = [
    { label: t('settings.system'), value: 'system' },
    { label: t('settings.light'), value: 'light' },
    { label: t('settings.dark'), value: 'dark' },
  ];

  const languageOptions = [
    { label: 'Português (Brasil)', value: 'pt-BR' },
    { label: 'English', value: 'en' },
  ];

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('common.confirm_logout', 'Tem certeza que deseja sair da sua conta?'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        onPress: async () => {
          try {
            await authService.logout();
            logout();
          } catch (error) {
            Alert.alert(t('common.error'), t('common.logout_error', 'Não foi possível fazer logout'));
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const getThemeLabel = () => {
    switch (preferences?.theme) {
      case 'dark': return t('settings.dark');
      case 'light': return t('settings.light');
      default: return t('settings.system');
    }
  };

  const getLanguageLabel = () => {
    return preferences?.language === 'pt-BR' ? 'Português (Brasil)' : 'English';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
        <View style={styles.profileBox}>
          {user?.photoURL ? (
            <RNImage
              source={{ uri: user.photoURL }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarContainer}>
              <Ionicons
                name="person-circle-outline"
                size={48}
                color={colors.primary}
              />
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || t('common.user', 'Usuário')}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Link Google Button - Only show if Google is not already linked */}
        {!isGoogleLinked && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => promptAsync()}
            disabled={!request || isLinking}
          >
            <Ionicons name="logo-google" size={20} color={colors.primary} />
            <Text style={styles.linkText}>{isLinking ? t('settings.linking') : t('settings.link_google')}</Text>
          </TouchableOpacity>
        )}
        {isGoogleLinked && (
          <View style={[styles.linkButton, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.linkText, { color: colors.success }]}>Google vinculado</Text>
          </View>
        )}
      </View>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.administration')}</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('Approvals')}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>{t('settings.approvals')}</Text>
                <Text style={styles.settingValue}>{t('settings.manage_requests', 'Gerenciar solicitações')}</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="people-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>{t('common.family', 'Família')}: {family?.name || t('common.loading')}</Text>
                <Text style={styles.settingValue}>{t('common.code', 'Código')}: {family?.code || '...'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={copyToClipboard} style={{ padding: 8 }}>
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('FamilyMembers')}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="people-circle-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>{t('settings.manage_members')}</Text>
                <Text style={styles.settingValue}>{t('settings.view_list', 'Ver lista e permissões')}</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>

        {/* Theme */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowThemePicker(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="sunny" size={24} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('settings.theme')}</Text>
              <Text style={styles.settingValue}>{getThemeLabel()}</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Language */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowLanguagePicker(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons
              name="language-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('settings.language')}</Text>
              <Text style={styles.settingValue}>{getLanguageLabel()}</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Notifications */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('settings.notifications')}</Text>
              <Text style={styles.settingValue}>
                {preferences.notifications ? t('settings.active') : t('settings.inactive')}
              </Text>
            </View>
          </View>
          <Switch
            value={preferences.notifications}
            onValueChange={(value) => setPreferences({ notifications: value })}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor="#FFF"
          />
        </View>

        {/* Manage Categories */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation.navigate('ManageCategories')}
        >
          <View style={styles.settingLeft}>
            <Ionicons
              name="pricetags-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Gerenciar Categorias</Text>
              <Text style={styles.settingValue}>Criar e deletar categorias personalizadas</Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('settings.version')}</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <PickerModal
        visible={showThemePicker}
        title={t('settings.theme')}
        options={themeOptions}
        onSelect={(value) =>
          setPreferences({ theme: value as 'light' | 'dark' | 'system' })
        }
        onClose={() => setShowThemePicker(false)}
      />

      <PickerModal
        visible={showLanguagePicker}
        title={t('settings.language')}
        options={languageOptions}
        onSelect={(value) =>
          setPreferences({ language: value as 'pt-BR' | 'en' })
        }
        onClose={() => setShowLanguagePicker(false)}
      />
    </ScrollView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.surface, // Or distinctive color?
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600'
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
  },
  logoutText: {
    color: '#FFF',
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
