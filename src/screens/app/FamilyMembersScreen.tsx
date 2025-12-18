import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/userStore';
import { familyService } from '@src/firebase';
import { spacing, fontSize, fontWeight } from '@styles/spacing';
import type { User, UserRole } from '@types';
import PickerModal from '@components/PickerModal';

export default function FamilyMembersScreen() {
    const colors = useThemeColors();
    const { user } = useUserStore();
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [showRolePicker, setShowRolePicker] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        if (!user?.familyId) return;
        setLoading(true);
        try {
            const data = await familyService.getFamilyMembers(user.familyId);
            setMembers(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os membros.');
        } finally {
            setLoading(false);
        }
    };

    const handleMemberPress = (member: User) => {
        // Only admins can change roles
        if (user?.role !== 'admin') return;

        // Prevent changing own role potentially lock out?
        // Actually, allowing admin to demote themselves might be dangerous if they are the only admin.
        // For now, let's allow it but maybe warn? Or just allow it.

        setSelectedMember(member);
        setShowRolePicker(true);
    };

    const handleRoleChange = async (newRole: string) => {
        if (!selectedMember) return;

        try {
            await familyService.updateMemberRole(selectedMember.uid, newRole as UserRole);

            // Optimistic update
            setMembers(prev => prev.map(m =>
                m.uid === selectedMember.uid ? { ...m, role: newRole as UserRole } : m
            ));

            Alert.alert('Sucesso', 'Permissão atualizada com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao atualizar permissão.');
        } finally {
            setShowRolePicker(false);
            setSelectedMember(null);
        }
    };

    const roleOptions = [
        { label: 'Administrador', value: 'admin' },
        { label: 'Pai/Mãe', value: 'parent' },
        { label: 'Dependente', value: 'dependent' },
    ];

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'parent': return 'Pai/Mãe';
            case 'dependent': return 'Dependente';
            default: return role;
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            style={[styles.memberCard, { backgroundColor: colors.surface }]}
            onPress={() => handleMemberPress(item)}
            disabled={user?.role !== 'admin'}
        >
            <View style={styles.avatarContainer}>
                {item.photoURL ? (
                    <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle" size={40} color={colors.textSecondary} />
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: colors.text }]}>
                    {item.displayName || item.email?.split('@')[0] || 'Usuário'}
                    {item.uid === user?.uid && ' (Você)'}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
            </View>

            <View style={styles.roleContainer}>
                <Text style={[styles.role, { color: colors.primary }]}>
                    {getRoleLabel(item.role)}
                </Text>
                {user?.role === 'admin' && (
                    <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.uid}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <PickerModal
                visible={showRolePicker}
                title={`Alterar papel de ${selectedMember?.displayName || 'Usuário'}`}
                options={roleOptions}
                onSelect={handleRoleChange}
                onClose={() => setShowRolePicker(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: spacing.md,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
    },
    email: {
        fontSize: fontSize.sm,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    role: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
    }
});
