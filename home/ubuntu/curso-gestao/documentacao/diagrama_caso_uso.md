# Diagrama de Caso de Uso

Este diagrama descreve as principais interações dos usuários (Aluno e Administrador) com o Sistema de Gestão de Cursos e Anotações.

## Atores

*   **Usuário (Geral):** Representa qualquer pessoa interagindo com as funcionalidades básicas antes ou durante a autenticação.
*   **Aluno:** Usuário autenticado com permissões de aluno.
*   **Administrador:** Usuário autenticado com permissões administrativas.

## Casos de Uso Principais

1.  **Gerenciar Conta (Geral/Aluno/Administrador):**
    *   Registrar-se no sistema
    *   Realizar Login
    *   Realizar Logout
    *   Visualizar Perfil
    *   Atualizar Perfil (Nome, Email, Senha)

2.  **Gerenciar Cursos (Aluno):**
    *   Visualizar Lista de Cursos
    *   Visualizar Detalhes de um Curso
    *   Matricular-se em um Curso
    *   Cancelar Matrícula em um Curso

3.  **Gerenciar Anotações (Aluno):**
    *   Criar Anotação para um Curso (requer matrícula)
    *   Visualizar Anotações de um Curso (próprias)
    *   Visualizar Todas as Anotações (próprias)
    *   Filtrar Anotações por Curso
    *   Deletar Anotação (própria)
    *   Atualizar Anotação (própria) - *Funcionalidade pode ser adicionada*

4.  **Gerenciar Cursos (Administrador):**
    *   Inclui todas as ações do Aluno
    *   Criar Novo Curso
    *   Atualizar Curso Existente
    *   Deletar Curso Existente
    *   Visualizar todos os alunos matriculados em um curso

5.  **Gerenciar Usuários (Administrador):**
    *   Visualizar Lista de Usuários
    *   Visualizar Detalhes de um Usuário
    *   Atualizar Papel de um Usuário (Aluno/Administrador) - *Funcionalidade pode ser adicionada*
    *   Deletar Usuário

6.  **Gerenciar Anotações (Administrador):**
    *   Visualizar Todas as Anotações de Todos os Usuários
    *   Visualizar Anotações por Usuário
    *   Visualizar Anotações por Curso (todas)
    *   Deletar Qualquer Anotação
    *   Visualizar Estatísticas de Anotações

## Relacionamentos

*   Aluno e Administrador **herdam** de Usuário (Geral).
*   Administrador **pode realizar** todas as ações de Aluno.
*   Casos de uso como "Criar Anotação" **incluem** a verificação de "Estar Matriculado no Curso".
*   A maioria dos casos de uso (exceto Registro e Login) **requer** "Estar Autenticado".
*   Casos de uso administrativos **requerem** "Ter Permissão de Administrador".
