const api = `https://pokeapi.co/api/v2/pokemon/`;

async function buscarPokemon() {
  const input = document.getElementById("pokemonProcura");
  const digitado = input.value.trim();

  if (digitado === "") {
    alert("Digite o nome ou número de um Pokémon!");
    return;
  }

  if (isNaN(digitado)) {
    console.log("Buscando por nome:", digitado);
  } else {
    console.log("Buscando por número:", digitado);
    if (digitado < 1 || digitado > 1025) {
      alert("ID inválido! Digite entre 1 e 1025.");
      return;
    }
  }

  const url = `${api}${digitado.toLowerCase()}`;
  getPokemon(url);
}

async function getPokemon(url) {
  try {
    const resposta = await fetch(url);

    if (resposta.status !== 200) {
      throw new Error("Pokémon não encontrado! Verifique o nome ou ID.");
    }

    const dados = await resposta.json();
    console.log("URL buscada:", url);
    console.log("Status:", resposta.ok);

    exibirDados(dados);
  } catch (erro) {
    alert(erro.message);
    console.log(erro.message);
  }
}

// Add a função de tradução para o tipo do Pokemon, mais acessibilidade né

function exibirDados(dados) {
  const nome = dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
  document.getElementById("pokemonNome").textContent = `NOME: ${nome}`;

  const tipos = dados.types
    .map((t) => tiposPT[t.type.name] || t.type.name)
    .join(", ");
  document.getElementById("pokemonTipo").textContent = `TIPO: ${tipos}`;

  const alturaM = (dados.height / 10).toFixed(1).replace(".", ",");
  document.getElementById("pokemonAltura").textContent = `ALTURA: ${alturaM} m`;

  const pesoKg = (dados.weight / 10).toFixed(1).replace(".", ",");
  document.getElementById("pokemonPeso").textContent = `PESO: ${pesoKg} kg`;

  const imagem = document.getElementById("pokemonIMG");
  imagem.src = dados.sprites.front_default;
  imagem.alt = dados.name;
}

const tiposPT = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

// Navegação com botões Anterior / Seguinte
let pokemonAtualId = 1;

async function navegarPokemon(direcao) {
  const input = document.getElementById("pokemonProcura");
  const digitado = input.value.trim();

  if (!isNaN(digitado) && digitado !== "") {
    pokemonAtualId = parseInt(digitado);
  }

  pokemonAtualId += direcao;

  if (pokemonAtualId < 1) pokemonAtualId = 1;
  if (pokemonAtualId > 1025) pokemonAtualId = 1025;

  input.value = pokemonAtualId;
  const url = `${api}${pokemonAtualId}`;
  getPokemon(url);
}

// Enter no input busca o Pokémon
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("pokemonProcura")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") buscarPokemon();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const som = new Audio("./audio/pikomon.mp3");
  som.volume = 0.4;

  const tocarUmaVez = () => {
    som.play();
    document.body.removeEventListener("click", tocarUmaVez); // remove após tocar
  };


  som.play().catch(() => {
    document.body.addEventListener("click", tocarUmaVez);
  });

  document
    .getElementById("pokemonProcura")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") buscarPokemon();
    });
});
