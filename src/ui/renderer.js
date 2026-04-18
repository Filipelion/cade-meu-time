export function renderGames(data) {
  const gamesList = document.getElementById('games-list');
  gamesList.innerHTML = '';

  for (let i = 0; i < data.team_home.length; i++) {
    gamesList.appendChild(buildGameCard(data, i));
  }
}

function buildGameCard(data, i) {
  const card = document.createElement('div');
  card.className = 'game';

  const info = document.createElement('div');
  info.className = 'game-info';

  const league = document.createElement('span');
  league.className = 'game-league';
  league.textContent = data.campeonato[i];

  const teams = document.createElement('div');
  teams.className = 'game-teams';
  teams.append(
    buildTeamEl(data.team_home[i], data.img_src_home[i], 'home'),
    buildVsEl(),
    buildTeamEl(data.team_away[i], data.img_src_away[i], 'away'),
  );

  const date = document.createElement('span');
  date.className = 'game-date';
  date.textContent = formatDate(data.datas[i]);

  info.append(league, teams, date);

  const venue = data.local?.[i];
  if (venue) {
    const venueEl = document.createElement('span');
    venueEl.className = 'game-venue';
    venueEl.innerHTML = `<svg class="venue-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${venue}`;
    info.appendChild(venueEl);
  }

  card.appendChild(info);
  return card;
}

function buildTeamEl(name, imgSrc, side) {
  const div = document.createElement('div');
  div.className = `${side}-team-div`;

  const icon = document.createElement('img');
  icon.className = `${side}-team-icon`;
  icon.src = imgSrc;
  icon.alt = name;

  const label = document.createElement('span');
  label.className = `${side}-team-name`;
  label.textContent = name;

  // home: [icon][name]  →  name adjacent to VS
  // away: [name][icon]  →  name adjacent to VS, icon on far right
  if (side === 'away') {
    div.append(label, icon);
  } else {
    div.append(icon, label);
  }
  return div;
}

function buildVsEl() {
  const vs = document.createElement('span');
  vs.className = 'vs-text';
  vs.textContent = 'VS';
  return vs;
}

function formatDate(parts) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const time = parts[parts.length - 1];
  if (parts.length === 2) return `${capitalize(parts[0])} às ${time}`;
  return `${capitalize(parts[0])} ${parts[1]} às ${time}`;
}
