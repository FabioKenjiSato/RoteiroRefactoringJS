const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {

    function getPeca(apresentacao) {
        return pecas[apresentacao.id];
    }

    function calcularTotalApresentacao(apre) {
        let total = 0;
        switch (getPeca(apre).tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                    total += 1000 * (apre.audiencia - 30);
                }
                break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
        }
        return total;
    }

    // Função extraída
    function calcularCredito(apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre).tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    // Função extraída
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        }).format(valor / 100);
    }

    let total = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    // const format = ... // Variável local removida

    for (let apre of fatura.apresentacoes) {

        let totalApresentacao = calcularTotalApresentacao(apre);

        // Créditos - Chama a função extraída
        creditos += calcularCredito(apre);

        // Fatura - Chama a função extraída
        faturaStr += ` ${getPeca(apre).nome}: ${formatarMoeda(totalApresentacao)} (${apre.audiencia} assentos)\n`;
        total += totalApresentacao;
    }

    faturaStr += `Valor total: ${formatarMoeda(total)}\n`; // Chama a função extraída
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
}

// --- Main ---
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);