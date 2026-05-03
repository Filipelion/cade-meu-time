# Extensão do Chrome - Maior do Nordeste

## Descrição

A Extensão do Chrome "Maior do Nordeste" é uma ferramenta que permite aos fãs do [Sport Club do Recife](https://sportrecife.com.br/) acompanhar as notícias mais recentes e os próximos jogos de seu time favorito diretamente no navegador.

<p align="center">
  <a rel="noreferrer noopener" href="https://chromewebstore.google.com/detail/maior-do-nordeste-sport-c/lcjnhdjijcehakhghaflnocpmmeacilm">
    <img alt="Disponível na Chrome Web Store" src="https://img.shields.io/badge/Instalar%20no%20Chrome-E30613.svg?&style=for-the-badge&logo=google-chrome&logoColor=white">
  </a>
</p>

<p align="center">
  <img src="https://github.com/Filipelion/cade-meu-time/blob/main/screenshots/proximosJogos.png" alt="Captura de tela da extensão - &quot;Próximos jogos&quot;">
</p>
<p align="center">
  Captura de tela da extensão - "Próximos jogos"
</p>
<p align="center">
  <img src="https://github.com/Filipelion/cade-meu-time/blob/main/screenshots/jogosEncerrados.png" alt="Captura de tela da extensão - &quot;Jogos Encerrados&quot;">
</p>
<p align="center">
  Captura de tela da extensão - "Jogos Encerrados"
</p>
<p align="center">
  <img src="https://github.com/Filipelion/cade-meu-time/blob/main/screenshots/noticias.png" alt="Captura de tela da extensão - &quot;Noticias&quot;">
</p>
<p align="center">
  Captura de tela da extensão - "Noticias"
</p>
<p align="center">
  <img src="https://github.com/Filipelion/cade-meu-time/blob/main/screenshots/videos.png" alt="Captura de tela da extensão - &quot;Videos&quot;">
</p>
<p align="center">
  Captura de tela da extensão - "Videos"
</p>


## Recursos

- **Próximos jogos** com data, horário, competição, local e transmissão de cada partida. Clique no card para abrir os detalhes no placardefutebol.com.br.
- **Placar ao vivo** — detecta automaticamente quando o Sport está em campo e exibe o placar e o minuto em tempo real.
- **Botão YouTube ao vivo** — quando disponível, exibe acesso direto à transmissão no YouTube.
- **Contador regressivo** para o próximo jogo (opcional, ativável por toggle).
- **Jogos Encerrados** — histórico dos últimos resultados com placar e data.
- **Ingressos** — quando o próximo jogo for em casa, exibe os planos disponíveis com link direto para compra.
- **Modo escuro** com persistência de preferência.
- **Contador de Sócios** — exibe o número atualizado de sócios do clube.
- Acesse os principais portais de notícias sobre o Sport Club do Recife.
- Links rápidos para os canais de vídeo: TVSport (YouTube), Globo Esporte e Instagram oficial.

## Instalação

A forma mais simples é instalar pela Chrome Web Store:

<p align="center">
  <a rel="noreferrer noopener" href="https://chromewebstore.google.com/detail/maior-do-nordeste-sport-c/lcjnhdjijcehakhghaflnocpmmeacilm">
    <img alt="Disponível na Chrome Web Store" src="https://img.shields.io/badge/Instalar%20no%20Chrome-E30613.svg?&style=for-the-badge&logo=google-chrome&logoColor=white">
  </a>
</p>

Para carregar o código-fonte diretamente (modo desenvolvedor):

1. Clone o repositório ou faça o download do código-fonte.
2. Abra o Google Chrome.
3. Acesse `chrome://extensions/` na barra de endereços.
4. Ative o modo Desenvolvedor no canto superior direito da página.
5. Clique em "Carregar sem compactação" e selecione a pasta **`src/`** do projeto.
6. A extensão será carregada e estará pronta para uso.

## Como Usar

Após a instalação, você verá o ícone da extensão na barra de ferramentas do Chrome. Clique no ícone para abrir a extensão.

### Jogos

- Selecione a guia "Jogos" para ver os próximos jogos do Sport, com data, horário, local e canal de transmissão.
- Clique em um card para abrir os detalhes da partida no placardefutebol.com.br.
- Quando houver transmissão no YouTube, o botão "Assistir ao vivo" aparece abaixo da TV.
- Se o Sport estiver em campo, o placar ao vivo é exibido automaticamente no topo.
- Clique no botão "Jogos Encerrados" para ver os últimos resultados.
- Use o toggle no canto superior direito para alternar entre modo claro e escuro.

### Notícias

- Selecione a guia "Notícias" para acessar os principais portais de cobertura do Sport Club do Recife.

### Vídeos

- Selecione a guia "Vídeos" para acessar os canais de vídeo do Sport (YouTube, Globo Esporte e Instagram).

## Estrutura do Projeto

```
src/                    ← pasta a ser carregada no Chrome
  manifest.json
  popup.html
  popup.js              ← orquestra toda a inicialização
  constants.js          ← textos, seletores e URLs centralizados
  analytics.js          ← Google Analytics 4
  style.css             ← importa os módulos de styles/
  styles/
    variables.css       ← CSS variables para temas claro/escuro
    base.css
    games.css
    tabs.css
    tickets.css
    toggles.css
    socios.css
    media.css
  services/
    cache.js            ← localStorage com TTLs por dataset
    gamesApi.js         ← scraping do placardefutebol.com.br
    liveGamesApi.js     ← polling de placar ao vivo
    sociosApi.js        ← contagem de sócios
    ticketsApi.js       ← ingressos via API maiordonordeste.com.br
  ui/
    renderer.js         ← constrói os cards de jogos, live e ingressos
    tabs.js             ← lógica de troca de abas
    darkMode.js         ← toggle de modo escuro
tests/                  ← testes Playwright E2E (não incluídos na extensão)
  fixtures/
    index.js            ← contexto Chrome compartilhado por worker
    mock-data.js        ← HTML/JSON falsos para todas as rotas
  helpers/
    page-setup.js       ← setup(), setupWithYoutube(), enableDark()
  broadcast.spec.js
  dark-mode.spec.js
  finished-games.spec.js
  footer.spec.js
  game-card.spec.js
  hover-effects.spec.js
  hyperlinks.spec.js
  tabs.spec.js
  youtube-button.spec.js
```

## Desenvolvimento e Testes

O projeto usa [Playwright](https://playwright.dev/) para testes E2E que carregam a extensão real no Chrome.

```bash
npm install                                       # primeira vez
npx playwright install chromium                   # primeira vez
npm test                                          # todos os testes
npx playwright test --grep "Dark mode"            # um describe específico
npx playwright test tests/youtube-button.spec.js  # um arquivo específico
```

Para recarregar a extensão após mudanças no código: `chrome://extensions/` → botão de reload → reabrir o popup.

Para forçar novo fetch de dados (limpar cache):
```js
localStorage.clear()  // no DevTools do popup
```

Os testes cobrem: renderização dos cards de jogos, clickabilidade dos cards, botão YouTube (presença, link, UX, cores em light/dark), broadcast, modo escuro, troca de abas, efeitos de hover, jogos encerrados, footer/sócios e todos os hiperlinks.

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua nova funcionalidade: `git checkout -b feature/nova-funcionalidade`.
3. Realize as alterações e faça commit delas: `git commit -m 'Adiciona nova funcionalidade'`.
4. Envie as alterações para o repositório: `git push origin feature/nova-funcionalidade`.
5. Crie um novo Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT.

## Disclaimer

Este projeto foi criado e otimizado com a ajuda do ChatGPT da OpenAI e do Claude Code da Anthropic.
Esta extensão foi desenvolvida de maneira independente. Sem qualquer auxílio ou responsabilidade do Sport Club do Recife.

---
Desenvolvido por [Filipe Freitas] e [Victor Leuthier]
