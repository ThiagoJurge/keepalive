# 🚧 KeepAlive – Monitoramento em Tempo Real (Em Desenvolvimento)

![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)

> ⚠️ Projeto em estágio inicial. As funcionalidades estão em constante evolução e melhorias estão sendo aplicadas regularmente.

**KeepAlive** é um sistema de monitoramento contínuo voltado para verificar a **disponibilidade de aplicações e serviços** em tempo real. Ideal para ambientes que exigem alta confiabilidade e resposta imediata em caso de falhas.

---

## 🔍 Funcionalidades

### ✅ Verificações de Disponibilidade
- **Ping (ICMP):** Verifica a resposta do host.
- **Validação de Portas (TCP/UDP):** Confirma se as portas estão acessíveis.
- **Teste de Abertura de Aplicações:** Checa se a aplicação está no ar (sem validação de erros HTTP).

<p align="center">
  <img src="https://img001.prntscr.com/file/img001/stxeOhUxQEO7XTak3H_jFA.png" alt="Tela Principal" width="600"/>
</p>

---

### 📈 Dashboard em Tempo Real
- Visualização gráfica e contínua da saúde das aplicações monitoradas.

<p align="center">
  <img src="https://img001.prntscr.com/file/img001/VMvuzmCUQim71_-PbttoFg.png" alt="Dashboard" width="400"/>
  <img src="https://img001.prntscr.com/file/img001/lt-pKWpBTBmoBlqjgT4dSA.png" alt="Dashboard 2" width="400"/>
</p>

---

### ➕ Cadastro de Aplicações
- Interface simples e intuitiva para adicionar novas aplicações ao monitoramento.

---

### 🤖 Notificações Inteligentes
- **Alertas automáticos via WhatsApp** sempre que uma falha for detectada.

<p align="center">
  <img src="https://img001.prntscr.com/file/img001/7AhDxF6WQY2rDCuI8SAJHw.png" alt="Alerta WhatsApp" width="300"/>
</p>

---

## ⚙️ Tecnologias Utilizadas

| Camada            | Tecnologia                                                                                     |
|-------------------|------------------------------------------------------------------------------------------------|
| Backend           | ![Python](https://img.shields.io/badge/Python-Flask-blue?logo=python)                          |
| Frontend          | ![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)                            |
| Bot de Notificação| ![Node.js](https://img.shields.io/badge/Node.js-JavaScript-brightgreen?logo=node.js)           |
| Containerização   | ![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)                                |
| Banco de Dados    | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)  |

---

## 📌 Próximos Passos

- [ ] Autenticação de usuários
- [ ] Integrações com outras plataformas de mensagens (e-mail, Telegram, etc.)
- [ ] Exportação de relatórios