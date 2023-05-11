document.addEventListener('DOMContentLoaded', function() {
  var gameInfoElement = document.getElementById('game-info');
  var apiKey = 'live_ece97839f17299d05e0d42989d0f96';
  var url = 'https://api.api-futebol.com.br/v1/times/1/partidas/proximas';

  function getNextGame() {
    var headers = {
      'Authorization': 'Bearer ' + apiKey
    };

    fetch(url, { headers: headers })
      .then(response => response.json())
      .then(data => {
        // Processar a resposta da API aqui
        // Exemplo de atualização do conteúdo do elemento gameInfoElement:
        gameInfoElement.innerText = 'Próximo jogo: ' + data.nomeTime1 + ' vs. ' + data.nomeTime2 + ' - Data: ' + data.data;
      })
      .catch(error => {
        // Lidar com erros
        console.error(error);
      });
  }

  // Chamada inicial para obter o próximo jogo
  getNextGame();
});
