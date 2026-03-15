import { CONFIG } from './config.js';

const inputNick = document.querySelector('#inputNick');
const inputTag = document.querySelector('#inputTag');
const pCompleto = document.querySelector('#pCompleto');

const btnBuscar = document.querySelector('#btnBuscar');

const apiKey = CONFIG.API_KEY;

const encontraPuuid = async () => {

    // Armazenando o nick e tag em suas variáveis
    const nick = inputNick.value.trim();
    const tag = inputTag.value.trim();

    // Transformando o nick em um formato aceito por URL ex: "Machine Herald" -> "Machine%20Herald"
    // Utilizando o encodeURIComponent
    const nickEncoded = encodeURIComponent(nick);
    const tagEncoded = encodeURIComponent(tag);


    // Montando a URL da requisição
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickEncoded}/${tagEncoded}?api_key=${apiKey}`;
    
    // Executando o fech e armazenando o resultado em result
    const result = await fetch(url);
    
    // Armazenando o result convertido e json na variavel dados
    const dados = await result.json();

    console.log(dados);

    // Retorna apenas o puuid do player
    return dados;
}

const encontraElo = async (puuid) => {
    
    const url = `https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${apiKey}`;
    const result = await fetch(url);
    const dadosElo = await result.json();

    console.log(dadosElo);
    return dadosElo;
}

const mostraDados = async (nickPlayer, tier, rank, lp) => {
    pCompleto.textContent = `${nickPlayer}: ${tier} ${rank} - ${lp} PDL`;
}

const executar = async () => {
    const puuidPlayer = await encontraPuuid();
    console.log("O puuID do player é: " + puuidPlayer.puuid);

    const resultadoElo = await encontraElo(puuidPlayer.puuid);
    await mostraDados(puuidPlayer.gameName, resultadoElo[0].tier, resultadoElo[0].rank, resultadoElo[0].leaguePoints);
}

btnBuscar.addEventListener('click', executar);
