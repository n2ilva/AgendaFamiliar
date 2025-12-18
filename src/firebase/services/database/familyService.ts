import firebase from 'firebase/compat/app';
import { firestore } from '../../config/firebase.config';
import { userService } from './userService';
import type { Family, User, ApprovalRequest } from '@types';

const FAMILIES_COLLECTION = 'families';
const APPROVALS_COLLECTION = 'approvals';
const USERS_COLLECTION = 'users';

/**
 * Serviço de Família
 * 
 * Responsável por operações relacionadas a famílias e aprovações
 * Segue o Single Responsibility Principle (SRP)
 */
export const familyService = {
    /**
     * Gera um código aleatório de 6 caracteres para a família
     */
    generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    /**
     * Cria uma nova família
     */
    async createFamily(name: string, user: User): Promise<Family> {
        const code = this.generateCode();
        const familyData: Omit<Family, 'id'> = {
            name,
            code,
            createdBy: user.uid,
            createdAt: new Date().toISOString(),
        };

        try {
            // 1. Create Family Doc
            const docRef = await firestore.collection(FAMILIES_COLLECTION).add(familyData);
            const familyId = docRef.id;

            // 2. Update User (Admin Role)
            await userService.createUserProfile({
                ...user,
                familyId,
                role: 'admin',
            });

            return { id: familyId, ...familyData };
        } catch (error) {
            console.error('[FamilyService] Error creating family:', error);
            throw error;
        }
    },

    /**
     * Entra em uma família existente usando um código
     */
    async joinFamily(code: string, user: User): Promise<Family> {
        try {
            // 1. Find Family by Code
            const snapshot = await firestore
                .collection(FAMILIES_COLLECTION)
                .where('code', '==', code.toUpperCase())
                .limit(1)
                .get();

            if (snapshot.empty) {
                throw new Error('Código inválido ou família não encontrada.');
            }

            const familyDoc = snapshot.docs[0];
            const familyId = familyDoc.id;
            const familyData = familyDoc.data() as Omit<Family, 'id'>;

            // 2. Update User (Dependent Role)
            await userService.createUserProfile({
                ...user,
                familyId,
                role: 'dependent',
            });

            return { id: familyId, ...familyData } as Family;
        } catch (error) {
            console.error('[FamilyService] Error joining family:', error);
            throw error;
        }
    },

    /**
     * Cria uma solicitação de aprovação
     */
    async createApprovalRequest(request: Omit<ApprovalRequest, 'id' | 'createdAt' | 'status'>): Promise<void> {
        try {
            await firestore.collection(APPROVALS_COLLECTION).add({
                ...request,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error('[FamilyService] Error creating approval request:', error);
            throw error;
        }
    },

    /**
     * Obtém aprovações pendentes de uma família
     */
    async getPendingApprovals(familyId: string): Promise<ApprovalRequest[]> {
        try {
            const snapshot = await firestore
                .collection(APPROVALS_COLLECTION)
                .where('familyId', '==', familyId)
                .where('status', '==', 'pending')
                .get();

            return snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString()
            })) as ApprovalRequest[];
        } catch (error) {
            console.error('[FamilyService] Error getting approvals:', error);
            return [];
        }
    },

    /**
     * Processa uma aprovação (aprova ou rejeita)
     */
    async processApproval(requestId: string, action: 'approved' | 'rejected'): Promise<void> {
        try {
            await firestore.collection(APPROVALS_COLLECTION).doc(requestId).update({
                status: action
            });
        } catch (error) {
            console.error('[FamilyService] Error processing approval:', error);
            throw error;
        }
    },

    /**
     * Inscreve-se para receber atualizações de aprovações em tempo real
     */
    subscribeToApprovals(familyId: string, onUpdate: (requests: ApprovalRequest[]) => void): () => void {
        return firestore
            .collection(APPROVALS_COLLECTION)
            .where('familyId', '==', familyId)
            .where('status', '==', 'pending')
            .onSnapshot((snapshot: any) => {
                const requests = snapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString()
                })) as ApprovalRequest[];
                onUpdate(requests);
            });
    },

    /**
     * Obtém detalhes de uma família
     */
    async getFamilyDetails(familyId: string): Promise<Family | null> {
        try {
            const doc = await firestore.collection(FAMILIES_COLLECTION).doc(familyId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() } as Family;
            }
            return null;
        } catch (error) {
            console.error('[FamilyService] Error getting family details:', error);
            return null;
        }
    },

    /**
     * Obtém membros de uma família
     */
    async getFamilyMembers(familyId: string): Promise<User[]> {
        try {
            const snapshot = await firestore
                .collection(USERS_COLLECTION)
                .where('familyId', '==', familyId)
                .get();

            return snapshot.docs.map((doc: any) => doc.data() as User);
        } catch (error) {
            console.error('[FamilyService] Error getting family members:', error);
            return [];
        }
    },

    /**
     * Atualiza o papel de um membro da família
     */
    async updateMemberRole(uid: string, newRole: User['role']): Promise<void> {
        try {
            await userService.updateUserProfile(uid, { role: newRole });
        } catch (error) {
            console.error('[FamilyService] Error updating member role:', error);
            throw error;
        }
    }
};

export default familyService;
