const SOCIOS_URL = "https://maiordonordeste.com.br/api/v1/numeros";

export async function fetchSocios() {
  const response = await fetch(SOCIOS_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
