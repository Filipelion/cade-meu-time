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

- Próximos jogos do Sport com **data, horário e competição** de cada partida.
- Botão de acesso rápido aos **Jogos Encerrados** no Globo Esporte.
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

- Selecione a guia "Jogos" para ver os próximos jogos do Sport, com data, horário e local da partida.
- Clique no botão "Jogos Encerrados" para ver o histórico no Globo Esporte.
- Use o toggle no canto superior direito para alternar entre modo claro e escuro.

### Notícias

- Selecione a guia "Notícias" para acessar os principais portais de cobertura do Sport Club do Recife.

### Vídeos

- Selecione a guia "Vídeos" para acessar os canais de vídeo do Sport (YouTube, Globo Esporte e Instagram).

## Estrutura do Projeto

```
src/                  ← pasta a ser carregada no Chrome
  manifest.json
  popup.html
  style.css
  icon.png
  popup.js
  services/
    cache.js          ← cache com TTL de 24h em localStorage
    gamesApi.js       ← scraping do placardefutebol.com.br
  ui/
    renderer.js       ← renderização dos cards de jogos
    tabs.js           ← lógica de troca de abas
    darkMode.js       ← toggle de modo escuro
tests/                ← testes Playwright (não incluídos na extensão)
```

## Desenvolvimento e Testes

O projeto usa [Playwright](https://playwright.dev/) para testes end-to-end da extensão.

```bash
npm install
npx playwright test
```

Os testes cobrem: alternância de modo escuro, troca de abas, efeitos de hover (modo claro e escuro) e todos os hiperlinks.

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
