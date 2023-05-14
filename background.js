function getNextGame() {
  document.addEventListener('DOMContentLoaded', function() {
    var gameInfoElement = document.getElementById('game-info');
    const url = 'https://www.placardefutebol.com.br/time/sport/proximos-jogos';
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const html = xhr.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const dataElement = doc.querySelector('.match__lg_card--datetime');
        const leagueElement = doc.querySelector('.match__lg_card--league');
        const teamsElement = doc.querySelectorAll('.match__lg_card--ht-name.text');

        const data = dataElement ? dataElement.textContent.trim().split('\n').map(item => item.trim()).filter(item => item !== '') : 'Data não encontrada';
        const liga = leagueElement ? leagueElement.textContent.trim() : 'Liga não encontrada';
        const times = Array.from(teamsElement).map(element => element.textContent);

        var info = liga + "<br>" + times[0] + " VS " + times[1] + "<br>" ;
        var data_pretty = data[0] + "às" + data[1];
        gameInfoElement.innerText = info + data_pretty;
      }
    };

    xhr.open('GET', url);
    xhr.send();

/*     var gameInfo = 'Próximo jogo: ' + timeMandante + ' vs. ' + timeVisitante + ' - Data: ' + dataPartida;
    console.log('gameInfo' + gameInfo);

    
    */
  
  });
    
}

getNextGame();
