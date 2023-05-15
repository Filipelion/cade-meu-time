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

function parseHTML(html) {
  var parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

var url = 'https://www.placardefutebol.com.br/time/sport/proximos-jogos';
getRequest(url, function (responseText) {
  var html = parseHTML(responseText);
  var data_elements = html.querySelectorAll('.match__lg_card--datetime');
  var datas = Array.from(data_elements).map(function (element) {
    return element.textContent.trim().split(' ') || 'Data não encontrada';
  });

  var league_elements = html.querySelectorAll('.match__lg_card--league');
  var campeonato = Array.from(league_elements).map(function (element) {
    return element.textContent.trim() || 'Liga não encontrada';
  });

  var home_teams_elements = html.querySelectorAll('.match__lg_card--ht-name.text');
  var away_teams_elements = html.querySelectorAll('.match__lg_card--at-name.text');
  var team_home = Array.from(home_teams_elements).map(function (element) {
    return element.textContent.trim() || 'Time da casa não encontrado';
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

  var gamesList = document.getElementById('games-list');

  for (var i = 0; i < home_teams_elements.length; i++) {
    var gameContainer = document.createElement('div');
    gameContainer.className = 'game';

    var homeTeam = document.createElement('div');
    homeTeam.className = 'home-team-div';

    var homeIcon = document.createElement('img');
    homeIcon.className = 'home-team-icon';
    homeIcon.src = img_src_home[i];

    var homeTeamName = document.createElement('span');
    homeTeamName.className = 'home-team-name';
    homeTeamName.textContent = team_home[i];

    homeTeam.appendChild(homeIcon);
    homeTeam.appendChild(homeTeamName);

    var vsText = document.createElement('span');
    vsText.className = 'vs-text';
    vsText.textContent = 'VS';

    var awayTeam = document.createElement('div');
    awayTeam.className = 'away-team-div';

    var awayTeamName = document.createElement('span');
    awayTeamName.className = 'away-team-name';
    awayTeamName.textContent = team_away[i];

    var awayIcon = document.createElement('img');
    awayIcon.className = 'away-team-icon';
    awayIcon.src = img_src_away[i];

    awayTeam.appendChild(awayIcon);
    awayTeam.appendChild(awayTeamName);

    var gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';

    var gameLeague = document.createElement('span');
    gameLeague.className = 'game-league';
    gameLeague.textContent = campeonato[i];
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

    if (datas[i].length === 2) {
      gameDate.textContent = datas[i][0].charAt(0).toUpperCase() + datas[i][0].slice(1) + ' às ' + datas[i][datas[i].length - 1];
    } else {
      gameDate.textContent = datas[i][0].charAt(0).toUpperCase() + datas[i][0].slice(1) + ' ' + datas[i][1] + ' às ' + datas[i][datas[i].length - 1];
    }

    gameInfo.appendChild(gameLeague);
    gameInfo.appendChild(gameTeams);
    gameInfo.appendChild(gameDate);

    gameContainer.appendChild(gameInfo);

    gamesList.appendChild(gameContainer);
  }
});
