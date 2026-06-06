# 📚 E-book Hub

Loja de e-books digital com design premium, integração Pix via GoatPay e deploy otimizado para Vercel.

---

## ✨ Funcionalidades

- **300 e-books** organizados em 10 categorias
- **Paginação** de 30 e-books por página
- **QR Code Pix dinâmico** via GoatPay
- **Download automático** após confirmação do pagamento
- **Design Dark SaaS** com Framer Motion
- **Totalmente responsivo** (mobile-first)
- **App Router** do Next.js 14

---

## 🗂️ Estrutura de Diretórios

```
ebook-hub/
├── app/
│   ├── layout.tsx                  # Layout raiz com fontes e metadados
│   ├── page.tsx                    # Homepage
│   ├── HeroSection.tsx             # Seção hero animada
│   ├── StatsBar.tsx                # Barra de estatísticas
│   ├── globals.css                 # Estilos globais + Tailwind
│   ├── not-found.tsx               # Página 404
│   ├── categoria/
│   │   └── [slug]/
│   │       ├── page.tsx            # Página de categoria (SSG)
│   │       └── CategoryPageClient.tsx  # Componente com paginação
│   └── api/
│       ├── checkout/
│       │   ├── route.ts            # POST: cria cobrança GoatPay
│       │   └── status/
│       │       └── route.ts        # GET: verifica status do pagamento
│       └── webhook/
│           └── route.ts            # POST: recebe confirmação GoatPay
├── components/
│   ├── navbar/
│   │   └── Navbar.tsx              # Navegação com glassmorphism
│   ├── cards/
│   │   ├── EbookCard.tsx           # Card de e-book com animações
│   │   └── CategoryCard.tsx        # Card de categoria
│   ├── modal/
│   │   └── CheckoutModal.tsx       # Modal com QR Code Pix
│   └── ui/
│       └── Pagination.tsx          # Componente de paginação
├── data/
│   └── ebooks.ts                   # 300 e-books + categorias (mock data)
├── lib/
│   ├── goatpay.ts                  # Client da API GoatPay
│   └── utils.ts                    # Utilitários (cn, formatCurrency, etc.)
├── public/
│   └── downloads/                  # Arquivos PDF dos e-books (NÃO commitar)
├── .env.example                    # Template de variáveis de ambiente
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Deploy na Vercel

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/ebook-hub.git
cd ebook-hub
npm install
```

### 2. Configure variáveis de ambiente locais

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOATPAY_API_KEY=sua_chave_aqui
GOATPAY_WEBHOOK_SECRET=seu_secret_aqui
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

> **Modo demo**: sem `GOATPAY_API_KEY`, o sistema usa QR Code mock e simula pagamento após 10 segundos.

### 4. Build de produção

```bash
npm run build
npm start
```

### 5. Deploy na Vercel

```bash
# Via CLI
npm i -g vercel
vercel

# Ou conecte o repositório GitHub em https://vercel.com/new
```

### 6. Configure variáveis na Vercel

No painel **Vercel → Seu Projeto → Settings → Environment Variables**, adicione:

| Variável | Valor | Ambiente |
|---|---|---|
| `GOATPAY_API_KEY` | Sua chave da GoatPay | Production, Preview |
| `GOATPAY_WEBHOOK_SECRET` | Secret do webhook | Production |
| `NEXT_PUBLIC_BASE_URL` | `https://seu-projeto.vercel.app` | Production |

---

## 💳 Configuração da GoatPay

1. Acesse [app.goatpay.com.br](https://app.goatpay.com.br)
2. Vá em **Configurações → API** e copie sua `API Key`
3. Vá em **Configurações → Webhooks** e cadastre:
   - URL: `https://seu-projeto.vercel.app/api/webhook`
   - Eventos: `charge.paid`
4. Copie o **Webhook Secret** gerado

---

## 📥 Adicionando arquivos de e-books

Coloque os PDFs em `public/downloads/` com o padrão de nome:

```
public/downloads/ebook-001.pdf
public/downloads/ebook-002.pdf
...
public/downloads/ebook-300.pdf
```

Os IDs dos e-books são `ebook-001` até `ebook-300`.

> **Segurança**: Para downloads protegidos (somente após pagamento), use URLs assinadas com expiração via S3/R2/Cloudflare, em vez de arquivos públicos.

---

## 🔧 Personalização

### Alterar preço

Em `data/ebooks.ts`, mude o valor de `PRICE`. Em `app/api/checkout/route.ts`, ajuste a validação correspondente.

### Adicionar categorias

No array `categories` em `data/ebooks.ts`, adicione um novo objeto seguindo o padrão existente. Crie os templates dos e-books em `ebookTemplates` com a mesma chave do `slug`.

### Alterar número de e-books por página

Em `data/ebooks.ts`, a função `paginateEbooks` usa 30 por padrão. Altere o parâmetro `perPage`.

---

## 🛠️ Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14 | Framework (App Router) |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | 3 | Estilos |
| Framer Motion | 11 | Animações |
| Axios | 1.7 | Requisições HTTP |
| Lucide React | 0.408 | Ícones |
| GoatPay | — | Pagamento Pix |

---

## 📄 Licença

MIT © E-book Hub
