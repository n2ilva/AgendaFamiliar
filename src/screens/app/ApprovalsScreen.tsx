import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUserStore } from '@store/userStore';
import { useTaskStore } from '@store/taskStore';
import { familyService, taskService } from '@src/firebase';
import { Colors } from '@styles/colors';
import { useThemeColors } from '@hooks/useThemeColors';
import type { ApprovalRequest } from '@types';

export default function ApprovalsScreen() {
    const user = useUserStore((state) => state.user);
    const themeColors = useThemeColors();
    const styles = makeStyles(themeColors);

    const [requests, setRequests] = useState<ApprovalRequest[]>([]);

    useEffect(() => {
        if (!user || !user.familyId || user.role !== 'admin') return;

        const unsubscribe = familyService.subscribeToApprovals(user.familyId, (data) => {
            setRequests(data);
        });

        return () => unsubscribe();
    }, [user]);

    const handleApprove = async (request: ApprovalRequest) => {
        try {
            if (request.action === 'delete') {
                await taskService.deleteTask(request.taskId);
                // Also need to clean up notification in store? 
                // Best to call taskStore.deleteTask IF we can bypass the check?
                // The store check blocks only if role != admin.
                // Since we are here, we ARE admin.
                // So we can use taskStore methods!
                // But wait, the component might be different. 
                // Importing store actions directly.
                useTaskStore.getState().deleteTask(request.taskId);
            } else {
                // Update or Complete
                await useTaskStore.getState().updateTask(request.taskId, request.data);
            }

            await familyService.processApproval(request.id, 'approved');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao aprovar solicitação.');
        }
    };

    const handleReject = async (request: ApprovalRequest) => {
        try {
            await familyService.processApproval(request.id, 'rejected');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao rejeitar.');
        }
    };

    const renderItem = ({ item }: { item: ApprovalRequest }) => {
        let actionText = '';
        switch (item.action) {
            case 'update': actionText = 'Alteração'; break;
            case 'delete': actionText = 'Exclusão'; break;
            case 'complete': actionText = 'Conclusão'; break;
        }

        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.user}>{item.userName}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
                </View>
                <Text style={styles.details}>Solicitou: <Text style={styles.bold}>{actionText}</Text></Text>
                <Text style={styles.subDetails}>Tarefa ID: ...{item.taskId.slice(-4)}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item)}>
                        <Text style={styles.buttonText}>Rejeitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => handleApprove(item)}>
                        <Text style={styles.buttonText}>Aprovar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (user?.role !== 'admin') {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Apenas administradores podem ver esta tela.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aprovações Pendentes</Text>
            {requests.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    user: {
        fontWeight: 'bold',
        color: colors.text,
        fontSize: 16,
    },
    date: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    details: {
        color: colors.text,
        fontSize: 14,
        marginBottom: 4,
    },
    subDetails: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 40,
    }
});
