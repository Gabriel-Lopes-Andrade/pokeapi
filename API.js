const api = `https://pokeapi.co/api/v2/pokemon/`;
//          ↑ Você criou isso certo! É a URL base da PokéAPI.
//            Toda busca vai usar ela como ponto de partida.


async function buscarPokemon() {

    // CORREÇÃO 1: Você tinha "entrada" mas a variável certa é o valor do input
    // SEU CÓDIGO:  isNaN(entrada)   ← "entrada" não existe, causa erro!
    // CORRETO:     pegar o .value do input primeiro, depois usar isNaN

    const input = document.getElementById('pokemonProcura');
    const digitado = input.value.trim();
    //   .value  → lê o texto que o usuário digitou
    //   .trim() → remove espaços acidentais nas pontas

    // Validação: campo vazio
    if (digitado === "") {
        alert("Digite o nome ou número de um Pokémon!");
        return; // para a função aqui
    }

    // isNaN decide se é nome ou número
    // isNaN("pikachu") → true  → é texto → busca por nome
    // isNaN("4")       → false → é número → busca por ID
    if (isNaN(digitado)) {
        console.log("Buscando por nome:", digitado);
    } else {
        console.log("Buscando por número:", digitado);
        // Valida intervalo numérico
        if (digitado < 1 || digitado > 1025) {
            alert("ID inválido! Digite entre 1 e 1025.");
            return;
        }
    }

    // Monta a URL completa usando a variável "api"
    // Exemplo: "https://pokeapi.co/api/v2/" + "pokemon/pikachu"
    const url = `${api}${digitado.toLowerCase()}`;

    // Chama a função que busca os dados
    getDados(url);
}


// CORREÇÃO 2: getDados estava buscando dados de outra API (de imagens aleatórias)
// e chamava filtrarDados() que tentava fazer forEach — isso não funciona com a PokéAPI
// SEU CÓDIGO:
//   const dados = await (await fetch(url)).json();
//   filtrarDados(dados);          ← errado para PokéAPI
//   dados.forEach(...)            ← PokéAPI não retorna array, retorna objeto!
//
// CORRETO: a PokéAPI retorna UM objeto com os dados do Pokémon
async function getDados(url) {
    try {
        const resposta = await fetch(url);

        // Verifica se o Pokémon foi encontrado
        if (!resposta.ok) {
            alert("Pokémon não encontrado! Verifique o nome ou ID.");
            return;
        }

        // Converte a resposta em objeto JavaScript
        const dados = await resposta.json();
        console.log(url); // você já tinha isso, mantive

        // Agora chama a função que coloca os dados na tela
        exibirDados(dados);

    } catch (erro) {
        alert("Erro de conexão. Verifique sua internet.");
        console.error(erro);
    }
}


// CORREÇÃO 3: filtrarDados tentava usar forEach (para arrays) e inserirIMG
// que não existia. A PokéAPI retorna um OBJETO, não um array.
// Renomeei para exibirDados e corrigi a lógica.
function exibirDados(dados) {
    // dados é um objeto com esta estrutura (simplificada):
    // {
    //   id: 4,
    //   name: "charmander",
    //   height: 6,          ← em decímetros
    //   weight: 85,         ← em hectogramas
    //   types: [ {type: {name: "fire"}} ],
    //   sprites: { front_default: "https://...charmander.png" }
    // }

    // --- Nome com primeira letra maiúscula ---
    const nome = dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
    document.getElementById("pokemonNome").textContent = `NOME: ${nome}`;

    // --- Tipo ---
    const tipos = dados.types.map(t => t.type.name).join(", ");
    document.getElementById("pokemonTipo").textContent = `TIPO: ${tipos}`;

    // --- Altura: de decímetros para metros (padrão brasileiro) ---
    // API retorna 6 → dividir por 10 → 0,6 m
    const alturaM = (dados.height / 10).toFixed(1).replace(".", ",");
    document.getElementById("pokemonAltura").textContent = `ALTURA: ${alturaM} m`;

    // --- Peso: de hectogramas para kg (padrão brasileiro) ---
    // API retorna 85 → dividir por 10 → 8,5 kg
    const pesoKg = (dados.weight / 10).toFixed(1).replace(".", ",");
    document.getElementById("pokemonPeso").textContent = `PESO: ${pesoKg} kg`;

    // --- Imagem ---
    // A URL da imagem está DENTRO dos dados, em dados.sprites.front_default
    const imagem = document.getElementById("pokemonIMG");
    imagem.src = dados.sprites.front_default;
    imagem.alt = dados.name;
}


// Permite buscar teclando Enter
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pokemonNome").addEventListener("keydown", function (e) {
        if (e.key === "Enter") buscarPokemon();
    });
});