# Backend Auth JWT

Backend Node.js + Express + MongoDB com autenticação JWT.

## Rotas

- `POST /api/users` — cadastrar usuário
- `POST /api/users/login` — fazer login
- `GET /api/users/profile` — buscar perfil do usuário logado
- `PUT /api/users/profile` — atualizar usuário logado

## Como rodar

```bash
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```env
NODE_ENV=development
PORT=3333
MONGO_URI=mongodb://localhost/unirota
JWT_SECRET=sua_chave_secreta_aqui
```

Depois rode:

```bash
npm run dev
```

## Exemplo de login

```json
{
  "email": "teste@email.com",
  "password": "123456"
}
```

## Como acessar rota protegida

No header da requisição, envie:

```txt
Authorization: Bearer SEU_TOKEN_AQUI
```
