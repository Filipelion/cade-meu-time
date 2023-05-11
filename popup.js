document.addEventListener('DOMContentLoaded', function() {
  var gameInfoElement = document.getElementById('game-info');
  
  // Função para obter as informações do próximo jogo
  function getNextGame() {
    // Aqui você deve implementar a lógica para buscar as informações do próximo jogo do Sport Club do Recife, por exemplo, através de uma API ou raspagem de dados de um site confiável.
    // Após obter as informações, atualize o conteúdo do elemento gameInfoElement.
    // Exemplo:
    gameInfoElement.innerText = 'Próximo jogo: Sport Club do Recife vs. Time X - Data: XX/XX/XXXX';
  }
  
  // Chamada inicial para obter o próximo jogo
  getNextGame();
});
