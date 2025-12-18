import { useState } from 'react';
import { Alert } from 'react-native';
import { familyService } from '@src/firebase';
import type { User, UserRole } from '@types';

/**
 * Custom hook to manage role changes for family members
 * Encapsulates role change logic with optimistic updates
 */
export const useRoleManagement = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateMemberRole = async (
        member: User,
        newRole: UserRole,
        onSuccess?: (updatedMember: User) => void
    ) => {
        setIsUpdating(true);
        try {
            await familyService.updateMemberRole(member.uid, newRole);

            const updatedMember = { ...member, role: newRole };

            if (onSuccess) {
                onSuccess(updatedMember);
            }

            Alert.alert('Sucesso', 'Função atualizada com sucesso!');
        } catch (error) {
            console.error('Error updating member role:', error);
            Alert.alert(
                'Erro',
                'Não foi possível atualizar a função. Tente novamente.'
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateMemberRole,
        isUpdating,
    };
};
