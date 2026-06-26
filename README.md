
<div align="center">
  <img src="public/images/logo.png" alt="Bora Beber Logo" width="150" height="150">
  <h1 align="center">Bora Beber - Delivery de Bebidas</h1>
  <p align="center">
    Um sistema completo de delivery de bebidas construído com as tecnologias mais modernas.
  </p>
</div>

<br/>

## 🛠️ Guia Técnico de Publicação e Migração

O botão **Publish** do Firebase Studio automatiza um fluxo que agora você pode controlar manualmente seguindo estes passos:

### 1. Como o app foi publicado (Bastidores)
Ao publicar pelo Studio, o sistema realiza os seguintes passos:
- **Build:** Executa `next build` para gerar a versão de produção.
- **Hosting:** Envia os arquivos para o **Firebase App Hosting**.
- **Infra:** Configura certificados SSL (HTTPS) e o servidor Cloud Run automaticamente.

### 2. Passo a Passo para a Migração (Transição Suave)
Para manter o app funcionando de forma independente, faça o seguinte:

1.  **Baixe o Código:** Clique no ícone de código `</>` no Studio e baixe o ZIP completo (este arquivo que você está lendo já contém os novos arquivos `.firebaserc` e `firebase.json` que eu adicionei).
2.  **GitHub:** Crie um repositório no seu GitHub e suba os arquivos para lá.
3.  **Console do Firebase:** No [Console do Firebase](https://console.firebase.google.com/), vá em **Build > App Hosting**.
4.  **Conexão:** Clique em "Começar" e selecione seu repositório do GitHub.
5.  **Secrets (Importante):** No painel do App Hosting, vá na aba **Settings > Secrets**. Você deve cadastrar as variáveis que estão no seu arquivo `.env` (como `NEXT_PUBLIC_FIREBASE_API_KEY`).
6.  **Domínio:** Se você tiver um domínio próprio (`www.meudelivery.com.br`), você o conectará nesta mesma tela de App Hosting.

### 3. O que acontece com o link antigo?
A URL gerada pelo Studio (`studio-xxxx.web.app`) continuará funcionando enquanto o Studio existir. Assim que você configurar o App Hosting, ele gerará uma **nova URL definitiva**. Você deve atualizar seus links e redes sociais para esta nova URL.

---

## 👨‍💻 Desenvolvedor
Projeto estruturado para escalabilidade e performance.
