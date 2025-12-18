# 🔍 Erros TypeScript Encontrados

## Erros Identificados:

### 1. Import de `colors` (deve ser `Colors`)
- `src/components/PickerModal.tsx`
- `src/navigation/RootNavigator.tsx`
- `src/screens/app/ApprovalsScreen.tsx`
- `src/screens/auth/FamilySetupScreen.tsx`

**Fix**: Trocar `colors` por `Colors`

### 2. Arquivos de tradução não encontrados
- `src/config/i18n.ts` - procurando `../constants/translations/`

**Fix**: Verificar se pasta `constants` existe na raiz

### 3. Parâmetros implícitos 'any'
- `src/infrastructure/repositories/FirestoreTaskRepository.ts` (linhas 101, 113)

**Fix**: Adicionar tipos explícitos

### 4. Propriedade `animationEnabled` não existe
- `src/navigation/AuthStack.tsx`

**Fix**: Remover ou substituir por propriedade válida

---

**Total**: ~10 erros
**Prioridade**: Média (não bloqueantes para execução)
