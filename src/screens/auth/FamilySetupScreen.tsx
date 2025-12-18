import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@store/userStore';
import { familyService } from '@src/firebase';
import { Colors } from '@styles/colors';
import { useThemeColors } from '@hooks/useThemeColors';

export default function FamilySetupScreen() {
    const [mode, setMode] = useState<'create' | 'join'>('create');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const user = useUserStore((state) => state.user);
    const themeColors = useThemeColors();

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'Por favor, digite o nome da família.');
            return;
        }
        if (!user) return;

        setLoading(true);
        try {
            await familyService.createFamily(name, user);
            // User store update is handled by userService/authService? 
            // No, familyService updates Firestore. We need to update local store too or reload profile.
            // For simplicity, we can manually update local user store here or trigger reload.
            // Actually, familyService updates Firestore. We should re-fetch profile to sync local store.
            const { authService } = require('@services/authService'); // Avoid cycle?
            await authService.reloadUserProfile();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao criar família.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!code.trim() || code.length !== 6) {
            Alert.alert('Erro', 'O código deve ter 6 caracteres.');
            return;
        }
        if (!user) return;

        setLoading(true);
        try {
            await familyService.joinFamily(code, user);
            const { authService } = require('@services/authService');
            await authService.reloadUserProfile();
        } catch (error) {
            Alert.alert('Erro', 'Código inválido ou erro ao entrar.');
        } finally {
            setLoading(false);
        }
    };

    const styles = makeStyles(themeColors);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Bem-vindo ao Agenda Familiar</Text>
                    <Text style={styles.subtitle}>
                        Para começar, você precisa criar uma nova família ou entrar em uma existente.
                    </Text>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, mode === 'create' && styles.activeTab]}
                            onPress={() => setMode('create')}
                        >
                            <Text style={[styles.tabText, mode === 'create' && styles.activeTabText]}>Criar Família</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, mode === 'join' && styles.activeTab]}
                            onPress={() => setMode('join')}
                        >
                            <Text style={[styles.tabText, mode === 'join' && styles.activeTabText]}>Entrar com Código</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {mode === 'create' ? (
                            <>
                                <Text style={styles.label}>Nome da Família</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Família Silva"
                                    placeholderTextColor={themeColors.textSecondary}
                                    value={name}
                                    onChangeText={setName}
                                />
                                <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Família</Text>}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Código da Família</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: X9J2K1"
                                    placeholderTextColor={themeColors.textSecondary}
                                    value={code}
                                    onChangeText={(t) => setCode(t.toUpperCase())}
                                    maxLength={6}
                                />
                                <TouchableOpacity style={styles.button} onPress={handleJoin} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar na Família</Text>}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabText: {
        color: '#FFF',
    },
    form: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: 16,
        elevation: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.text,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
