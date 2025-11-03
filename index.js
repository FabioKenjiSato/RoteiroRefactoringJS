const { readFileSync } = require('fs');

// Funções movidas para o escopo global
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

function getPeca(pecas, apre) { // 'pecas' agora é um parâmetro
    return pecas[apre.id];
}

function calcularCredito(pecas, apre) { // 'pecas' agora é um parâmetro
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);
    return creditos;
}

function calcularTotalCreditos(pecas, apresentacoes) { // 'pecas' e 'apresentacoes' são parâmetros
    let creditos = 0;
    for (let apre of apresentacoes) {
        creditos += calcularCredito(pecas, apre);
    }
    return creditos;
}

function calcularTotalApresentacao(pecas, apre) { // 'pecas' agora é um parâmetro
    let total = 0;
    switch (getPeca(pecas, apre).tipo) {
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
            throw new Error(`Peça desconhecida: ${getPeca(pecas, apre).tipo}`);
    }
    return total;
}

function calcularTotalFatura(pecas, apresentacoes) { // 'pecas' e 'apresentacoes' são parâmetros
    let total = 0;
    for (let apre of apresentacoes) {
        total += calcularTotalApresentacao(pecas, apre);
    }
    return total;
}

function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        // Atualiza chamadas para passar 'pecas'
        faturaStr += ` ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
    }
    // Atualiza chamadas para passar 'pecas' e 'fatura.apresentacoes'
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

// --- Main ---
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);