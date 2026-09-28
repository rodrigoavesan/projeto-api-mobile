// Serviço de acesso à Star Wars API (SWAPI). Não precisa de chave.
// Tenta o primeiro endereço e, se falhar, usa o segundo (espelho).
const BASES = ['https://swapi.info/api', 'https://swapi.dev/api'];
const MAX_ID = 83; // a SWAPI tem personagens de id 1 a 83 (o 17 não existe)

// GET em um caminho da API. Retorna null se o id não existir (404).
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

// A SWAPI não tem imagens. O Star Wars Visual Guide usa o mesmo id do personagem.
function imageUrl(id) {
  return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
}

// Converte o personagem da API para o formato simples usado nos cards
function toCard(p, id) {
  return {
    id,
    name: p.name,
    image: imageUrl(id),
    gender: p.gender,
    birthYear: p.birth_year,
    height: p.height,
    mass: p.mass,
    films: p.films?.length ?? 0,
    starships: p.starships?.length ?? 0,
    vehicles: p.vehicles?.length ?? 0,
  };
}

// Busca um personagem aleatório que ainda não esteja na lista (existingIds)
export async function fetchRandomCharacter(existingIds = []) {
  for (let i = 0; i < 15; i++) {
    const id = Math.floor(Math.random() * MAX_ID) + 1;
    if (existingIds.includes(id)) continue;
    const person = await get(`/people/${id}`);
    if (person) return toCard(person, id);
  }
  throw new Error('Não foi possível encontrar um novo personagem. Tente de novo.');
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
    ...toCard(p, id),
    hairColor: p.hair_color,
    skinColor: p.skin_color,
    eyeColor: p.eye_color,
    homeworld: homeworld?.name ?? 'Desconhecido',
    filmList: films, speciesList: species, vehicleList: vehicles, starshipList: starships,
  };
}
