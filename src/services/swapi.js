// Serviço de acesso à Star Wars API (SWAPI). Não precisa de chave.
// Tenta o primeiro endereço e, se falhar, usa o segundo (espelho).
const BASES = ['https://swapi.info/api', 'https://swapi.dev/api'];

// GET em um caminho da API, tentando cada endereço da lista.
async function get(path) {
  for (const base of BASES) {
    try {
      const response = await fetch(`${base}${path}`);
      if (response.status === 404) return null;
      if (response.ok) return await response.json();
    } catch (e) {
      // falha de rede: tenta o próximo endereço
    }
  }
  throw new Error('Não foi possível acessar a Star Wars API. Verifique sua internet.');
}

// GET em uma URL completa (usada para resolver planeta, filmes, naves...)
async function getByUrl(url) {
  try {
    const response = await fetch(url.replace('http://', 'https://'));
    return response.ok ? await response.json() : null;
  } catch (e) {
    return null;
  }
}

// Extrai o id numérico a partir da URL do personagem (funciona nos dois endereços da API)
function extractId(url) {
  const match = url.match(/\/people\/(\d+)/);
  return match ? Number(match[1]) : null;
}

// A SWAPI não tem imagens. Tentamos duas fontes, na ordem, pelo id do personagem.
// Se a primeira não tiver a foto, o app cai para a segunda automaticamente.
function imageSources(id) {
  return [
    `https://raw.githubusercontent.com/vieraboschkova/swapi-gallery/main/static/assets/img/people/${id}.jpg`,
    `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`,
  ];
}

// Converte o personagem da API para o formato simples usado nos cards
function toCard(p) {
  const id = extractId(p.url);
  return {
    id,
    name: p.name,
    imageSources: imageSources(id),
    gender: p.gender,
    birthYear: p.birth_year,
    height: p.height,
    mass: p.mass,
    films: p.films?.length ?? 0,
    starships: p.starships?.length ?? 0,
    vehicles: p.vehicles?.length ?? 0,
  };
}

// Busca personagens pelo nome digitado. Retorna até 10 resultados (nome parcial, sem diferenciar maiúsculas).
export async function searchCharacters(query) {
  const termo = query.trim().toLowerCase();
  if (!termo) return [];

  // 1ª tentativa: a API já filtra por nome (swapi.dev)
  try {
    const data = await get(`/people/?search=${encodeURIComponent(termo)}`);
    if (data?.results?.length) return data.results.slice(0, 10).map(toCard);
  } catch (e) {
    // segue para o plano B
  }

  // 2ª tentativa: baixa a lista inteira (swapi.info) e filtra aqui no app
  const lista = await get('/people');
  const todos = Array.isArray(lista) ? lista : lista?.results ?? [];
  return todos
    .filter((p) => p.name.toLowerCase().includes(termo))
    .slice(0, 10)
    .map(toCard);
}

// Busca os detalhes completos de um personagem (tela de detalhes)
export async function fetchCharacterDetails(id) {
  const p = await get(`/people/${id}`);
  if (!p) throw new Error('Personagem não encontrado.');

  // Os campos homeworld, films, species... vêm como URLs; buscamos cada uma para pegar o nome
  const names = async (urls, field) =>
    (await Promise.all((urls ?? []).map(getByUrl))).filter(Boolean).map((r) => r[field]);

  const [homeworld, films, species, vehicles, starships] = await Promise.all([
    p.homeworld ? getByUrl(p.homeworld) : null,
    names(p.films, 'title'),
    names(p.species, 'name'),
    names(p.vehicles, 'name'),
    names(p.starships, 'name'),
  ]);

  return {
    ...toCard({ ...p, url: p.url ?? `https://swapi.info/api/people/${id}` }),
    hairColor: p.hair_color,
    skinColor: p.skin_color,
    eyeColor: p.eye_color,
    homeworld: homeworld?.name ?? 'Desconhecido',
    filmList: films, speciesList: species, vehicleList: vehicles, starshipList: starships,
  };
}