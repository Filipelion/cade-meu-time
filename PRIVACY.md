# Política de Privacidade — Maior do Nordeste

**Última atualização:** abril de 2026

## 1. Dados coletados

Esta extensão **não coleta, armazena, transmite ou compartilha nenhum dado pessoal** do usuário.

## 2. Armazenamento local

A extensão utiliza o `localStorage` do próprio navegador exclusivamente para:

| Dado | Finalidade | Expiração |
|---|---|---|
| Preferência de modo escuro | Lembrar a escolha do usuário entre modo claro e escuro | Indefinida (preferência do usuário) |
| Cache de jogos | Evitar requisições repetidas ao placardefutebol.com.br | 24 horas |

Esses dados nunca saem do dispositivo do usuário e não são acessíveis por terceiros.

## 3. Requisições externas

A extensão realiza requisições às seguintes URLs para obter dados de jogos:

- `https://www.placardefutebol.com.br/time/sport/proximos-jogos` — listagem dos próximos jogos
- `https://www.placardefutebol.com.br/{jogo}` — detalhes individuais de cada partida (local/estádio)

Nenhum dado do usuário é enviado nessas requisições. São chamadas de leitura pública, equivalentes a visitar o site no navegador.

## 4. Links externos

A extensão exibe links para sites de terceiros (Globo Esporte, Sport Club do Recife, Folha de Pernambuco, JC, Meu Sport, YouTube, Instagram). Ao clicar em um link, o usuário é direcionado ao site externo, que possui sua própria política de privacidade.

## 5. Permissões declaradas no manifesto

| Permissão | Motivo |
|---|---|
| `host_permissions: placardefutebol.com.br` | Necessária para buscar os dados de jogos e locais das partidas |

Nenhuma outra permissão é solicitada.

## 6. Contato

Dúvidas ou sugestões sobre esta política podem ser criadas issues em [https://github.com/Filipelion/cade-meu-time/issues/new](https://github.com/Filipelion/cade-meu-time/issues/new)
