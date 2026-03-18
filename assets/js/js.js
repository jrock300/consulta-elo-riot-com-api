const inputNick = document.querySelector('#inputNick');
const inputTag = document.querySelector('#inputTag');
const imgElo = document.querySelector('#imgElo');
const pCompleto = document.querySelector('#pCompleto');
const btnBuscar = document.querySelector('#btnBuscar');
const btnLimpar = document.querySelector('#btnLimpar');

const elos = {
    IRON: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Iron.png?42102',
    BRONZE: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Bronze.png?bbe9f',
    SILVER: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Silver.png?46d71',
    GOLD: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Gold.png?46d71',
    PLATINUM: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Platinum.png?46d71',
    EMERALD: 'https://wiki.leagueoflegends.com/en-us/images/Season_2023_-_Emerald.png?3c53f',
    DIAMOND: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Diamond.png?17b04',
    MASTER: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Master.png?4c6ff',
    GRANDMASTER: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Grandmaster.png?7505b',
    CHALLENGER: 'https://wiki.leagueoflegends.com/en-us/images/Season_2022_-_Challenger.png?7505b'
};

const limpaCampos = () => {
    inputNick.value = "";
    inputTag.value = "";
};

const mostraDados = (nickPlayer, tier, rank, lp) => {

    const tierFormatado = tier?.toUpperCase().trim();
    const imagem = elos[tierFormatado];
    if(imagem) {
        imgElo.src = imagem;
    } else {
        imgElo.src = '';
    }

    pCompleto.textContent = `${nickPlayer}: ${tier} ${rank} - ${lp} PDL`;
};

const executar = async () => {

    const nick = inputNick.value.trim();
    const tag = inputTag.value.trim();

    if (!nick || !tag) {
        pCompleto.textContent = "Digite Nick e TAG.";
        return;
    }

    try {

        pCompleto.textContent = "Consultando...";

        const response = await fetch(`/api/riot?nick=${encodeURIComponent(nick)}&tag=${encodeURIComponent(tag)}`);

        if (!response.ok) {
            throw new Error("Erro na consulta");
        }

        const dados = await response.json();

        mostraDados(
            dados.gameName,
            dados.tier,
            dados.rank,
            dados.lp
        );

    } catch (error) {

        console.error(error);
        pCompleto.textContent = "Erro ao consultar jogador.";

    }
};

btnBuscar.addEventListener('click', executar);
btnLimpar.addEventListener('click', limpaCampos);