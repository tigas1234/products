# Simple Server - Usuários e Produtos

Servidor Node.js simples usando arquivos JSON como banco de dados.

## 🔹 Rotas de Usuário

- `GET /user` → Lista todos os usuários
- `POST /user` → Cria um novo usuário
  ```json
  {
    "name": "Ana",
    "email": "ana@email.com"
  }
