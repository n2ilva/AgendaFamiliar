# 🔥 Como Aplicar as Regras do Firestore

## ⚠️ IMPORTANTE: Você precisa aplicar as regras manualmente!

O erro `Missing or insufficient permissions` indica que as regras do Firestore não estão aplicadas ou estão desatualizadas.

---

## 📋 Passos para Aplicar as Regras

### 1. Acesse o Firebase Console
```
https://console.firebase.google.com/
```

### 2. Selecione seu Projeto
- Projeto: **agendafamiliarkotlin**

### 3. Vá para Firestore Database
- No menu lateral, clique em **Firestore Database**
- Clique na aba **Rules** (Regras)

### 4. Cole as Regras Atualizadas
Copie TODO o conteúdo do arquivo `firestore.rules` e cole no editor de regras.

**Arquivo:** `agenda-familiar/firestore.rules`

### 5. Publique as Regras
- Clique no botão **Publish** (Publicar)
- Aguarde a confirmação

---

## 📄 Regras Atualizadas (Copie e Cole)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Verifica se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Verifica se o usuário é o dono do documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Obtém os dados do usuário atual
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Verifica se o usuário pertence à família
    function belongsToFamily(familyId) {
      return isAuthenticated() && getUserData().familyId == familyId;
    }
    
    // Verifica se o usuário é admin da família
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }
    
    // Verifica se o usuário é admin da família específica
    function isAdminOfFamily(familyId) {
      return belongsToFamily(familyId) && isAdmin();
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    match /users/{userId} {
      // Leitura: Apenas o próprio usuário ou membros da mesma família
      allow read: if isOwner(userId) || 
                     (isAuthenticated() && belongsToFamily(resource.data.familyId));
      
      // Criação: Apenas o próprio usuário pode criar seu perfil
      allow create: if isOwner(userId) && 
                       request.resource.data.uid == userId;
      
      // Atualização: Apenas o próprio usuário ou admin da família
      allow update: if isOwner(userId) || 
                       (isAuthenticated() && 
                        isAdminOfFamily(resource.data.familyId) &&
                        // Admin pode alterar role, mas não pode se auto-rebaixar
                        (request.resource.data.role != 'dependent' || userId != request.auth.uid));
      
      // Exclusão: Apenas o próprio usuário
      allow delete: if isOwner(userId);
    }
    
    // ============================================
    // FAMILIES COLLECTION
    // ============================================
    match /families/{familyId} {
      // Leitura: Membros da família
      allow read: if belongsToFamily(familyId);
      
      // Criação: Qualquer usuário autenticado pode criar uma família
      allow create: if isAuthenticated() && 
                       request.resource.data.createdBy == request.auth.uid;
      
      // Atualização: Apenas admin da família
      allow update: if isAdminOfFamily(familyId);
      
      // Exclusão: Apenas o criador da família
      allow delete: if isAuthenticated() && 
                       resource.data.createdBy == request.auth.uid;
    }
    
    // ============================================
    // TASKS COLLECTION
    // ============================================
    match /tasks/{taskId} {
      // Leitura: 
      // - Tarefas privadas: apenas o criador
      // - Tarefas normais: membros da família
      allow read: if isAuthenticated() && (
                     // Private tasks: only creator can read
                     (resource.data.isPrivate == true && resource.data.createdBy == request.auth.uid) ||
                     // Non-private tasks: family members can read
                     (resource.data.isPrivate != true && belongsToFamily(resource.data.familyId))
                   );
      
      // Criação: Membros da família
      allow create: if isAuthenticated() && 
                       belongsToFamily(request.resource.data.familyId) &&
                       request.resource.data.createdBy == request.auth.uid &&
                       request.resource.data.familyId == getUserData().familyId;
      
      // Atualização: 
      // - Admin pode atualizar qualquer tarefa da família (exceto privadas de outros)
      // - Usuário pode atualizar suas próprias tarefas
      allow update: if isAuthenticated() && 
                       belongsToFamily(resource.data.familyId) &&
                       (
                         // User can update their own tasks
                         resource.data.createdBy == request.auth.uid ||
                         // Admin can update non-private tasks
                         (isAdminOfFamily(resource.data.familyId) && resource.data.isPrivate != true)
                       );
      
      // Exclusão (Soft Delete): 
      // - Admin pode deletar tarefas não-privadas
      // - Usuário pode deletar suas próprias tarefas
      allow update: if isAuthenticated() && 
                       belongsToFamily(resource.data.familyId) &&
                       request.resource.data.deletedAt != null &&
                       (
                         resource.data.createdBy == request.auth.uid ||
                         (isAdminOfFamily(resource.data.familyId) && resource.data.isPrivate != true)
                       );
      
      // Hard Delete: Apenas criador ou admin (para tarefas não-privadas)
      allow delete: if isAuthenticated() &&
                       (resource.data.createdBy == request.auth.uid ||
                        (isAdminOfFamily(resource.data.familyId) && resource.data.isPrivate != true));
    }
    
    // ============================================
    // APPROVALS COLLECTION
    // ============================================
    match /approvals/{approvalId} {
      // Leitura: Membros da família
      allow read: if isAuthenticated() && 
                     belongsToFamily(resource.data.familyId);
      
      // Criação: Membros da família podem criar solicitações
      allow create: if isAuthenticated() && 
                       belongsToFamily(request.resource.data.familyId) &&
                       request.resource.data.requestedBy == request.auth.uid &&
                       request.resource.data.status == 'pending';
      
      // Atualização: Apenas admin pode aprovar/rejeitar
      allow update: if isAdminOfFamily(resource.data.familyId) &&
                       // Só pode mudar o status
                       request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']) &&
                       // Status deve ser approved ou rejected
                       (request.resource.data.status == 'approved' || 
                        request.resource.data.status == 'rejected');
      
      // Exclusão: Apenas admin ou o solicitante pode deletar
      allow delete: if isAuthenticated() && 
                       (isAdminOfFamily(resource.data.familyId) || 
                        resource.data.requestedBy == request.auth.uid);
    }
    
    // ============================================
    // CATEGORIES COLLECTION
    // ============================================
    match /categories/{categoryId} {
      // Leitura: Membros da família
      allow read: if isAuthenticated() && 
                     belongsToFamily(resource.data.familyId);
      
      // Criação: Membros da família
      allow create: if isAuthenticated() && 
                       belongsToFamily(request.resource.data.familyId);
      
      // Atualização: Apenas admin
      allow update: if isAdminOfFamily(resource.data.familyId);
      
      // Exclusão: Apenas admin
      allow delete: if isAdminOfFamily(resource.data.familyId);
    }
    
    // ============================================
    // DENY ALL OTHER COLLECTIONS
    // ============================================
    // Qualquer outra coleção não especificada é bloqueada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ✅ Verificação

Após aplicar as regras, teste:

1. **Recarregue o app** (Ctrl+R ou Cmd+R)
2. **Verifique os logs** - não deve mais aparecer "Missing or insufficient permissions"
3. **Teste criar uma tarefa** - deve funcionar
4. **Teste filtrar tarefas** - deve funcionar

---

## 🔍 Se o Erro Persistir

### Verifique se as regras foram publicadas:
1. No Firebase Console, vá em **Firestore Database** → **Rules**
2. Verifique se a data de publicação é recente
3. Se não, clique em **Publish** novamente

### Verifique se o usuário está autenticado:
- Faça logout e login novamente no app

### Limpe o cache:
- No terminal do Expo: pressione `r` para reload
- Ou feche e abra o app novamente

---

## 📝 Nota Importante

As regras do Firestore são aplicadas **imediatamente** após a publicação. Não é necessário reiniciar o app, mas é recomendado fazer um reload para garantir.

---

**Status:** ⚠️ AÇÃO NECESSÁRIA - Aplique as regras manualmente no Firebase Console!
