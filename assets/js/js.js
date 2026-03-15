const inputNick = document.querySelector('#inputNick');
const inputTag = document.querySelector('#inputTag');
const pCompleto = document.querySelector('#pCompleto');
const btnBuscar = document.querySelector('#btnBuscar');

const mostraDados = (nickPlayer, tier, rank, lp) => {
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