# 🌱 VERT GROW

**Sistema Inteligente de Gestão de Cultivo**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Uma aplicação web moderna e responsiva para gestão completa de cultivos, com check-ins inteligentes, relatórios detalhados e interface otimizada para mobile.

## 🚀 **Demo**

**🌐 Aplicação Online:** [https://vert-grow.vercel.app/](https://vert-grow.vercel.app/)

## ✨ **Funcionalidades Principais**

### 📊 **Dashboard Inteligente**
- Visão geral do cultivo em tempo real
- Últimos check-ins com detalhes das atividades
- Estatísticas por fase de crescimento
- Alertas e recomendações automáticas

### 🌿 **Gestão de Plantas**
- Cadastro completo com strain, origem e dados técnicos
- Check-ins individuais e em lote
- Acompanhamento por fases (germinação, vegetativa, floração)
- Histórico detalhado de atividades

### 🏠 **Gestão de Tendas**
- Configuração de espaços de cultivo
- Cálculo automático de PPFD (μmol/m²/s)
- Controle de iluminação e capacidade
- Organização por ambientes

### 🌡️ **Monitoramento Ambiental**
- Registro de temperatura e umidade
- Indicadores visuais para valores ideais
- Filtros por tenda e período
- Estatísticas automáticas

### 📈 **Relatórios Detalhados**
- Análise de frequência de check-ins
- Tarefas mais realizadas
- Status por planta com alertas de atraso
- Recomendações baseadas em dados
- Insights automáticos do cultivo

### 🎯 **Check-ins Inteligentes**
- Sistema de tarefas categorizadas (rega, poda, inspeção, etc.)
- Feedback visual de sucesso/erro
- Observações detalhadas
- Histórico completo de atividades

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18.2.0** - Framework principal
- **Ant Design** - Sistema de design e componentes
- **Lucide React** - Ícones modernos e semânticos
- **Tailwind CSS** - Estilização utilitária
- **Bento Grid** - Layout modular e responsivo

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança de dados
- **Real-time subscriptions** - Atualizações em tempo real

### **Deploy & DevOps**
- **Vercel** - Deploy automático e CDN
- **GitHub Actions** - CI/CD (configurável)
- **Progressive Web App (PWA)** - Experiência mobile nativa

## 📱 **Interface e UX**

### **Design System**
- **Material Design** - Componentes consistentes
- **Mobile First** - Otimizado para dispositivos móveis
- **Paleta de cores** - Preto/branco com verde para ações
- **Espaçamento** - Múltiplos de 8px para consistência

### **Componentes Reutilizáveis**
- **Modais padronizados** - Sistema de steps com navegação
- **Bento Cards** - Layout modular para informações
- **Feedback visual** - Notificações de sucesso/erro
- **Loading states** - Indicadores de carregamento

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### **1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/vert-grow.git
cd vert-grow
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configure o Supabase**

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Execute os scripts SQL na pasta `/sql`:
   - `supabase_schema.sql` - Estrutura das tabelas
   - `supabase_rls_audit_and_fix_v2.sql` - Políticas de segurança

3. Configure as variáveis de ambiente:
```bash
# src/components (atualize as constantes)
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
```

### **4. Execute o projeto**
```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

### **5. Build para produção**
```bash
npm run build
# ou
yarn build
```

## 📊 **Estrutura do Banco de Dados**

### **Tabelas Principais**
- `user_profiles` - Perfis de usuários
- `plantas` - Cadastro de plantas
- `tendas` - Espaços de cultivo
- `checkins_planta` - Registros de check-ins
- `registros_ambientais` - Dados ambientais

### **Relacionamentos**
- Usuários → Plantas (1:N)
- Usuários → Tendas (1:N)
- Plantas → Check-ins (1:N)
- Tendas → Registros Ambientais (1:N)

## 🔐 **Segurança**

- **Row Level Security (RLS)** - Isolamento de dados por usuário
- **Autenticação JWT** - Tokens seguros para API
- **Validação de entrada** - Sanitização de dados
- **HTTPS obrigatório** - Comunicação criptografada

## 📈 **Performance**

- **Build otimizado:** 256.54 kB gzipped
- **Lazy loading** - Carregamento sob demanda
- **Cache inteligente** - Redução de requisições
- **Responsive design** - Otimizado para todos os dispositivos

## 🤝 **Contribuindo**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- ESLint configurado
- Prettier para formatação
- Commits semânticos
- Componentes funcionais com hooks

## 📝 **Roadmap**

### **Versão 2.0**
- [ ] Integração com IoT para sensores automáticos
- [ ] Notificações push baseadas em IA
- [ ] Marketplace de strains com recomendações
- [ ] Relatórios PDF exportáveis
- [ ] Modo offline com sincronização

### **Versão 2.1**
- [ ] Integração com Google Gemini AI (preparado)
- [ ] Calendário de cultivo automatizado
- [ ] Análise de imagens para detecção de problemas
- [ ] Sistema de gamificação

## 🐛 **Problemas Conhecidos**

- [ ] Cache agressivo em alguns navegadores (workaround implementado)
- [ ] Limitação de 10MB para uploads de imagens
- [ ] Suporte limitado para IE11

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 **Equipe**

- **Desenvolvimento:** VERT GROW Team
- **Design:** Material Design System
- **Backend:** Supabase

## 📞 **Suporte**

- **Issues:** [GitHub Issues](https://github.com/SEU_USUARIO/vert-grow/issues)
- **Documentação:** [Wiki do Projeto](https://github.com/SEU_USUARIO/vert-grow/wiki)
- **Email:** vertgrow@example.com

---

<div align="center">

**🌱 Feito com ❤️ para a comunidade de cultivadores**

[⭐ Star no GitHub](https://github.com/SEU_USUARIO/vert-grow) • [🐛 Reportar Bug](https://github.com/SEU_USUARIO/vert-grow/issues) • [💡 Sugerir Feature](https://github.com/SEU_USUARIO/vert-grow/issues)

</div>

