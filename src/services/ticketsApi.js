export async function fetchTickets() {
  const res = await fetch('https://maiordonordeste.com.br/jogos.json?periodo=futuro');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
