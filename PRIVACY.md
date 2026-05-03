# Política de Privacidade — Maior do Nordeste

**Última atualização:** abril de 2026

## 1. Dados coletados

Esta extensão **não coleta dados pessoais identificáveis** do usuário.

São coletados **dados de uso anônimos** por meio do Google Analytics 4 (GA4), descritos na seção 4.

## 2. Armazenamento local

A extensão utiliza o `localStorage` e o `sessionStorage` do próprio navegador exclusivamente para:

| Dado | Finalidade | Expiração |
|---|---|---|
| Preferência de modo escuro | Lembrar a escolha do usuário entre modo claro e escuro | Indefinida (preferência do usuário) |
| Preferência do contador regressivo | Lembrar se o contador está ativado | Indefinida (preferência do usuário) |
| Cache de próximos jogos | Evitar requisições repetidas ao placardefutebol.com.br | 24 horas |
| Cache de jogos encerrados | Evitar requisições repetidas ao placardefutebol.com.br | 1 hora |
| Cache de sócios | Evitar requisições repetidas à API do maiordonordeste.com.br | 7 dias |
| Cache de ingressos | Evitar requisições repetidas à API de ingressos | 5 minutos |
| `_ga_cid` (client ID aleatório) | Identificar o dispositivo de forma anônima no GA4 | Indefinida |
| `_ga_sid` (session ID) | Agrupar eventos da mesma sessão de uso no GA4 | Duração da sessão do navegador |

Esses dados permanecem no dispositivo do usuário e não são acessíveis por terceiros, exceto o `_ga_cid` e `_ga_sid`, que são enviados ao Google Analytics conforme descrito na seção 4.

## 3. Requisições externas

A extensão realiza requisições às seguintes URLs:

| URL | Finalidade |
|---|---|
| `https://www.placardefutebol.com.br/time/sport/proximos-jogos` | Listagem dos próximos jogos |
| `https://www.placardefutebol.com.br/time/sport/ultimos-jogos` | Listagem dos jogos encerrados e detecção de jogo ao vivo |
| `https://www.placardefutebol.com.br/reload/{jogo}` | Atualização de placar ao vivo (polling a cada 30s quando em jogo) |
| `https://www.placardefutebol.com.br/{jogo}` | Detalhes individuais de cada partida (local, transmissão, YouTube) |
| `https://maiordonordeste.com.br/api/v1/numeros` | Número atualizado de sócios do clube |
| `https://maiordonordeste.com.br/api/v1/jogos` | Dados de ingressos para o próximo jogo em casa |
| `https://www.google-analytics.com/g/collect` | Envio de eventos de uso anônimos ao GA4 |

As requisições ao placardefutebol.com.br e maiordonordeste.com.br são chamadas de leitura pública — nenhum dado do usuário é enviado.

## 4. Google Analytics (GA4)

A extensão utiliza o Google Analytics 4 para medir o uso de forma agregada e anônima. Os seguintes eventos são registrados:

| Evento | Quando ocorre |
|---|---|
| `page_view` | Ao abrir a extensão |
| `tab_click` | Ao alternar entre as abas Jogos, Notícias, Vídeos e Ingressos |
| `finished_games_toggle` | Ao abrir ou fechar a lista de jogos encerrados |
| `error` | Quando ocorre falha ao buscar dados (sem informação pessoal) |

Cada evento inclui um `client_id` gerado aleatoriamente (sem vínculo com nome, e-mail ou qualquer dado pessoal) e um `session_id` de sessão. Nenhum dado de localização, histórico de navegação ou identificação pessoal é transmitido.

Os dados coletados pelo Google Analytics estão sujeitos à [Política de Privacidade do Google](https://policies.google.com/privacy).

## 5. Links externos

A extensão exibe links para sites de terceiros (Globo Esporte, Sport Club do Recife, Folha de Pernambuco, JC, Meu Sport, YouTube, Instagram). Ao clicar em um link, o usuário é direcionado ao site externo, que possui sua própria política de privacidade.

## 6. Permissões declaradas no manifesto

| Permissão | Motivo |
|---|---|
| `host_permissions: placardefutebol.com.br` | Buscar dados de jogos e locais das partidas |
| `host_permissions: maiordonordeste.com.br` | Buscar o número atualizado de sócios do clube |
| `host_permissions: google-analytics.com` | Enviar eventos de uso anônimos ao GA4 |

## 7. Contato

Dúvidas ou sugestões sobre esta política podem ser enviadas via [https://github.com/Filipelion/cade-meu-time/issues/new](https://github.com/Filipelion/cade-meu-time/issues/new)
