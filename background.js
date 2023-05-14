function getNextGame() {
  document.addEventListener('DOMContentLoaded', function() {
    var gameInfoElement = document.getElementById('game-info');
  
    fetch('https://www.google.com/search?q=proximo+jogo+do+sport&oq=proximo+jogo+so&aqs=chrome.1.69i57j0i13i512l9.4362j1j7&sourceid=chrome&ie=UTF-8&bshm=bshwcqp/1#sie=t;/m/02vpvk;2;/m/0fnkb5;mt;fp;1;;;')
      .then(response => response.text())
      .then(html => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
  
        const gameElement = tempElement.querySelector('div.klwc-c');
  
        if (gameElement) {
          const nomeTime1 = gameElement.querySelector('span.klwc-team-names span:first-child').textContent;
          const nomeTime2 = gameElement.querySelector('span.klwc-team-names span:last-child').textContent;
          const data = gameElement.querySelector('span.klwc-date').textContent;
  
          gameInfoElement.innerText = `Próximo jogo: ${nomeTime1} vs ${nomeTime2} - Data: ${data}`;
        } else {
          gameInfoElement.innerText = 'Nenhum próximo jogo encontrado.';
        }
        gameInfoElement.innerText = "FOI??"
      })
      .catch(error => {
        console.error('Erro ao carregar a página:', error);
      });
  });
  
}
  