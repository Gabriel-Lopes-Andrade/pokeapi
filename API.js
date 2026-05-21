const api = `https://pokeapi.co/api/v2/pokemon/`;



async function buscarPokemon() {



    const input = document.getElementById('pokemonProcura');
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


    getDados(url);
}



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


function exibirDados(dados) {


    const nome = dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
    document.getElementById("pokemonNome").textContent = `NOME: ${nome}`;

    const tipos = dados.types.map(t => t.type.name).join(", ");
    document.getElementById("pokemonTipo").textContent = `TIPO: ${tipos}`;


    const alturaM = (dados.height / 10).toFixed(1).replace(".", ",");
    document.getElementById("pokemonAltura").textContent = `ALTURA: ${alturaM} m`;


    const pesoKg = (dados.weight / 10).toFixed(1).replace(".", ",");
    document.getElementById("pokemonPeso").textContent = `PESO: ${pesoKg} kg`;


    const imagem = document.getElementById("pokemonIMG");
    imagem.src = dados.sprites.front_default;
    imagem.alt = dados.name;
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pokemonNome").addEventListener("keydown", function (e) {
        if (e.key === "Enter") buscarPokemon();
    });
});
