export default async function handler(req, res) {

    // Pegando os parâmetros enviados na URL
    const { nick, tag, format } = req.query;

    // Pegando a API KEY nas variáveis de ambiente da Vercel
    const apiKey = process.env.RIOT_KEY;

    try {

        // Convertendo para formato seguro de URL
        const nickEncoded = encodeURIComponent(nick);
        const tagEncoded = encodeURIComponent(tag);

        // =========================
        // BUSCAR PUUID DO PLAYER
        // =========================
        const accountResponse = await fetch(
            `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickEncoded}/${tagEncoded}`,
            {
                headers: {
                    "X-Riot-Token": apiKey
                }
            }
        );

        const accountData = await accountResponse.json();
        const puuid = accountData.puuid;

        // =========================
        // BUSCAR ELO DO PLAYER
        // =========================
        const eloResponse = await fetch(
            `https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
            {
                headers: {
                    "X-Riot-Token": apiKey
                }
            }
        );

        const eloData = await eloResponse.json();

        const tier = eloData[0].tier;
        const rank = eloData[0].rank;
        const lp = eloData[0].leaguePoints;

        // =========================
        // FORMATAÇÃO DA RESPOSTA
        // =========================

        const message = `${accountData.gameName}: ${tier} ${rank} - ${lp} LP`;

        // Se for StreamElements → retorna texto
        if (format === "text") {

            res.status(200).send(message);
            return;

        }

        // Caso contrário → retorna JSON (para seu frontend)

        res.status(200).json({
            gameName: accountData.gameName,
            tier,
            rank,
            lp
        });

    } catch (error) {

        console.error(error);

        if (format === "text") {
            res.status(500).send("Erro ao consultar elo.");
            return;
        }

        res.status(500).json({ error: "Erro ao consultar API da Riot" });

    }
}


// // Exportamos uma função padrão (default) que será executada sempre que
// // alguém acessar a rota /api/riot no seu site.
// //
// // Exemplo de acesso:
// // seusite.vercel.app/api/riot?nick=player&tag=BR1
// //
// // A Vercel automaticamente transforma esse arquivo em um endpoint HTTP.
// export default async function handler(req, res) {

//     // req (request) = informações da requisição que o usuário fez
//     // res (response) = resposta que vamos enviar de volta para o usuário


//     // Pegamos os parâmetros enviados na URL
//     // Exemplo:
//     // /api/riot?nick=Faker&tag=KR1
//     //
//     // req.query contém esses parâmetros
//     const { nick, tag } = req.query;


//     // Aqui pegamos a API KEY guardada nas variáveis de ambiente da Vercel
//     // Ela NÃO fica visível para o usuário
//     const apiKey = process.env.RIOT_KEY;


//     // try/catch serve para capturar erros
//     // Se algo der errado na API da Riot, evitamos quebrar o sistema
//     try {

//         // Transformamos o nick e a tag em formato seguro para URL
//         // Exemplo:
//         // "Machine Herald" -> "Machine%20Herald"
//         const nickEncoded = encodeURIComponent(nick);
//         const tagEncoded = encodeURIComponent(tag);


//         // ================================
//         // PRIMEIRA REQUISIÇÃO
//         // ================================
//         //
//         // Aqui consultamos a API da Riot para descobrir o PUUID do jogador.
//         //
//         // O PUUID é um identificador único do jogador na Riot.
//         //
//         // Endpoint usado:
//         // riot/account/v1/accounts/by-riot-id
//         //
//         const accountResponse = await fetch(
//             `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickEncoded}/${tagEncoded}`,

//             {
//                 // Aqui enviamos a API KEY no header da requisição
//                 headers: {
//                     "X-Riot-Token": apiKey
//                 }
//             }
//         );


//         // Convertendo a resposta da Riot para JSON
//         const accountData = await accountResponse.json();


//         // Pegamos apenas o PUUID do jogador
//         const puuid = accountData.puuid;


//         // ================================
//         // SEGUNDA REQUISIÇÃO
//         // ================================
//         //
//         // Agora usamos o PUUID para consultar o elo do jogador.
//         //
//         // Endpoint usado:
//         // lol/league/v4/entries/by-puuid
//         //
//         const eloResponse = await fetch(
//             `https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,

//             {
//                 headers: {
//                     "X-Riot-Token": apiKey
//                 }
//             }
//         );


//         // Convertendo a resposta para JSON
//         const eloData = await eloResponse.json();


//         // ================================
//         // ENVIANDO A RESPOSTA PARA O FRONTEND
//         // ================================
//         //
//         // Aqui devolvemos apenas os dados necessários para o navegador.
//         //
//         // Isso evita mandar muita informação desnecessária.
//         //
//         res.status(200).json({

//             // nome do jogador
//             gameName: accountData.gameName,

//             // tier ex: GOLD
//             tier: eloData[0].tier,

//             // rank ex: IV
//             rank: eloData[0].rank,

//             // pontos de liga
//             lp: eloData[0].leaguePoints
//         });


//     } catch (error) {

//         // Se algo der errado, retornamos erro para o frontend
//         console.error(error);

//         res.status(500).json({
//             error: "Erro ao consultar API da Riot"
//         });

//     }
// }