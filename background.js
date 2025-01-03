// Função para verificar se a cache é válida (menos de 24h)
function isCacheValid() {
  const lastFetched = localStorage.getItem('lastFetched');
  const now = new Date().getTime();
  return lastFetched && (now - lastFetched < 24 * 60 * 60 * 1000); // 24h em milissegundos
}

// Função para fazer a requisição (GET)
function getRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr.responseText);
      }
  };
  xhr.send();
}

// Função para analisar o HTML
function parseHTML(html) {
  var parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

// Função principal que verifica cache ou faz requisição
function fetchData(url) {
  // Verifica se os dados estão no cache e se são válidos
  if (isCacheValid() && localStorage.getItem('gamesData')) {
      console.log("Usando dados do cache");
      const cachedData = JSON.parse(localStorage.getItem('gamesData'));
      renderGames(cachedData);
  } else {
      console.log("Cache expirado ou ausente. Fazendo nova requisição.");
      // Realiza a requisição e processa os dados
      getRequest(url, function (responseText) {
          var html = parseHTML(responseText);
          var data_elements = html.querySelectorAll('.match__lg_card--datetime');
          var datas = Array.from(data_elements).map(function (element) {
              return element.textContent.trim().split(' ') || 'Data não encontrada';
          });

          var league_elements = html.querySelectorAll('.match__lg_card--league');
          var campeonato = Array.from(league_elements).map(function (element) {
              return element.textContent.trim() || 'Campeonato não encontrado';
          });

          var home_teams_elements = html.querySelectorAll('.match__lg_card--ht-name.text');
          var away_teams_elements = html.querySelectorAll('.match__lg_card--at-name.text');
          var team_home = Array.from(home_teams_elements).map(function (element) {
              return element.textContent.trim() || 'Time mandante não encontrado';
          });
          var team_away = Array.from(away_teams_elements).map(function (element) {
              return element.textContent.trim() || 'Time visitante não encontrado';
          });

          var src_home_elements = html.querySelectorAll('.match__lg_card--ht-logo');
          var img_src_home = Array.from(src_home_elements).map(function (element) {
              return element.querySelector('img').getAttribute('src');
          });

          var src_away_elements = html.querySelectorAll('.match__lg_card--at-logo');
          var img_src_away = Array.from(src_away_elements).map(function (element) {
              return element.querySelector('img').getAttribute('src');
          });

          // Armazena os dados no cache
          const gamesData = {
              datas: datas,
              campeonato: campeonato,
              team_home: team_home,
              team_away: team_away,
              img_src_home: img_src_home,
              img_src_away: img_src_away
          };
          localStorage.setItem('gamesData', JSON.stringify(gamesData));
          localStorage.setItem('lastFetched', new Date().getTime().toString());

          renderGames(gamesData);
      });
  }
}

// Função para renderizar os jogos na página
function renderGames(data) {
  var gamesList = document.getElementById('games-list');
  gamesList.innerHTML = ''; // Limpa a lista antes de adicionar os novos dados

  for (var i = 0; i < data.team_home.length; i++) {
      var gameContainer = document.createElement('div');
      gameContainer.className = 'game';

      var homeTeam = document.createElement('div');
      homeTeam.className = 'home-team-div';

      var homeIcon = document.createElement('img');
      homeIcon.className = 'home-team-icon';
      homeIcon.src = data.img_src_home[i];

      var homeTeamName = document.createElement('span');
      homeTeamName.className = 'home-team-name';
      homeTeamName.textContent = data.team_home[i];

      homeTeam.appendChild(homeIcon);
      homeTeam.appendChild(homeTeamName);

      var vsText = document.createElement('span');
      vsText.className = 'vs-text';
      vsText.textContent = 'VS';

      var awayTeam = document.createElement('div');
      awayTeam.className = 'away-team-div';

      var awayTeamName = document.createElement('span');
      awayTeamName.className = 'away-team-name';
      awayTeamName.textContent = data.team_away[i];

      var awayIcon = document.createElement('img');
      awayIcon.className = 'away-team-icon';
      awayIcon.src = data.img_src_away[i];

      awayTeam.appendChild(awayIcon);
      awayTeam.appendChild(awayTeamName);

      var gameInfo = document.createElement('div');
      gameInfo.className = 'game-info';

      var gameLeague = document.createElement('span');
      gameLeague.className = 'game-league';
      gameLeague.textContent = data.campeonato[i];
      gameLeague.style.fontWeight = 'bold';

      var gameTeams = document.createElement('div');
      gameTeams.className = 'game-teams';

      gameTeams.appendChild(homeIcon);
      gameTeams.appendChild(homeTeam);
      gameTeams.appendChild(vsText);
      gameTeams.appendChild(awayTeam);
      gameTeams.appendChild(awayIcon);

      var gameDate = document.createElement('span');
      gameDate.className = 'game-date';

      if (data.datas[i].length === 2) {
          gameDate.textContent = data.datas[i][0].charAt(0).toUpperCase() + data.datas[i][0].slice(1) + ' às ' + data.datas[i][data.datas[i].length - 1];
      } else {
          gameDate.textContent = data.datas[i][0].charAt(0).toUpperCase() + data.datas[i][0].slice(1) + ' ' + data.datas[i][1] + ' às ' + data.datas[i][data.datas[i].length - 1];
      }

      gameInfo.appendChild(gameLeague);
      gameInfo.appendChild(gameTeams);
      gameInfo.appendChild(gameDate);

      gameContainer.appendChild(gameInfo);
      gamesList.appendChild(gameContainer);
  }
}

// Chama a função de fetch ao carregar a página
var url = 'https://www.placardefutebol.com.br/time/sport/proximos-jogos';
fetchData(url);

// Função de ativação das abas (sem alteração)
function activateTab(tabId) {
  // Remove a classe "active" de todas as abas e conteúdos
  const allTabs = document.querySelectorAll(".tab");
  allTabs.forEach(tab => tab.classList.remove("active"));
  const allContents = document.querySelectorAll(".content");
  allContents.forEach(content => content.classList.remove("active"));

  // Adicione a classe "active" à aba correspondente e ao conteúdo correspondente
  const tab = document.getElementById(tabId);
  const contentId = tabId.replace("tab-", "content-");
  const content = document.getElementById(contentId);

  if (tab && content) {
      tab.classList.add("active");
      content.classList.add("active");
  }
}

const tabGames = document.getElementById("tab-games");
const tabNews = document.getElementById("tab-news");
const tabVideos = document.getElementById("tab-videos");

tabGames.addEventListener("click", () => activateTab("tab-games", console.log("Tab > Games")));
tabNews.addEventListener("click", () => activateTab("tab-news", console.log("Tab > News")));
tabVideos.addEventListener("click", () => activateTab("tab-videos", console.log("Tab > Videos")));
