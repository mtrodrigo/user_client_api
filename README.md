# Sistema de Gerenciamento de E-commerce (API)

API completa para gerenciamento de produtos, vendas e usuários com autenticação JWT e upload de imagens.

## Tecnologias
- **Backend:** Node.js + Express
- **Banco de Dados:** MongoDB (Mongoose)
- **Autenticação:** JWT
- **Upload de Imagens:** Multer + ImgBB
- **Criptografia:** Crypto (para dados sensíveis)

## Estrutura do Projeto
```plaintext
src/
├── controllers/
│   ├── ProductController.js
│   ├── SalesController.js
│   └── UserController.js
├── models/
│   ├── Product.js
│   ├── Sales.js
│   └── User.js
├── routes/
│   ├── productRoutes.js
│   ├── salesRoutes.js
│   └── userRoutes.js
├── helpers/
|   ├── createUserToken.js
|   ├── decrypt.js
|   ├── encrypt.js
|   ├── getToken.js
|   ├── getUserByToken.js
│   ├── verifyTokenAdmin.js
│   └── verifyUserToken.js
└── index.js
```

## Autenticação
Rotas protegidas por:
- `verifyUserToken`: Usuários logados
- `verifyTokenAdmin`: Apenas administradores

## Rotas da API

###  Produtos
| Método | Rota                  | Descrição                  | Acesso |
|--------|-----------------------|----------------------------|--------|
| POST   | /products/create      | Cria produto com imagem    | Admin  |
| GET    | /products             | Lista todos os produtos    | Público|
| GET    | /products/:id         | Busca produto por ID       | Público|
| PATCH  | /products/:id         | Atualiza produto           | Admin  |
| DELETE | /products/delete/:id  | Remove produto             | Admin  |

###  Vendas
| Método | Rota                      | Descrição                  | Acesso       |
|--------|---------------------------|----------------------------|--------------|
| POST   | /sales/createsale         | Registra nova venda        | Usuário      |
| PATCH  | /sales/updateAttended/:id | Atualiza status da venda   | Admin        |
| GET    | /sales                    | Lista vendas               | Admin        |

###  Usuários
| Método | Rota              | Descrição              | Acesso |
|--------|-------------------|------------------------|--------|
| POST   | /users/register   | Registra novo usuário  | Público|
| GET    | /users/getall     | Lista todos os usuários| Admin  |
| PATCH  | /users/:id        | Atualiza usuário       | Admin  |
| DELETE | /users/:id        | Remove usuário         | Admin  |

##  Como Executar

### Pré-requisitos
- Node.js (v18+)
- MongoDB (local ou Atlas)
- Conta no ImgBB (para upload de imagens)

### Passos
1. Clone o repositório:
        git clone [URL_DO_REPOSITÓRIO]
        cd [NOME_DO_REPOSITÓRIO]

2. Instale as dependências:
        npm install

3. Configure o ambiente:
**Preencha as variáveis no arquivo .env**
		MONGODB_URI=sua_string_de_conexão
		JWT_SECRET=sua_chave_secreta_jwt
		API_KEY_IMGBB=sua_chave_do_imgbb
		CRYPTO_SECRET=chave_para_criptografia

4. Inicie o servidor:
        npm start

Desenvolvido por **Rodrigo Marques Tavares** | 🔗 [Linkedin](https://www.linkedin.com/in/rodrigo-marques-tavares-9482b4226/ "Linkedin") | [Whatsapp](https://wa.me/5535984061841 "Whatsapp")
