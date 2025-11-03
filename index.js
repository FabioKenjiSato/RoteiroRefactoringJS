const { readFileSync } = require('fs');

// Nova classe Repositorio
class Repositorio {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
    getPeca(apre) {
        return this.pecas[apre.id];
    }
}

class ServicoCalculoFatura {
    // Recebe 'repo' no construtor
    constructor(repo) {
        this.repo = repo;
    }

    // 'pecas' removido dos parâmetros
    calcularCredito(apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        // Usa this.repo
        if (this.repo.getPeca(apre).tipo === "comedia") creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    // 'pecas' removido dos parâmetros
    calcularTotalCreditos(apresentacoes) {
        let creditos = 0;
        for (let apre of apresentacoes) {
            creditos += this.calcularCredito(apre); // Passa 'apre'
        }
        return creditos;
    }

    // 'pecas' removido dos parâmetros
    calcularTotalApresentacao(apre) {
        let total = 0;
        // Usa this.repo
        switch (this.repo.getPeca(apre).tipo) {
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
                throw new Error(`Peça desconhecida: ${this.repo.getPeca(apre).tipo}`);
        }
        return total;
    }

    // 'pecas' removido dos parâmetros
    calcularTotalFatura(apresentacoes) {
        let total = 0;
        for (let apre of apresentacoes) {
            total += this.calcularTotalApresentacao(apre); // Passa 'apre'
        }
        return total;
    }
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

// getPeca(pecas, apre) // Função global removida

// 'pecas' removido do parâmetro
function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        // Usa calc.repo.getPeca
        faturaStr += ` ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
    // Comentado
}

// --- Main ---
const faturas = JSON.parse(readFileSync('./faturas.json'));
// const pecas = JSON.parse(readFileSync('./pecas.json')); // Removido

// Injeta o novo Repositorio no Servico
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc); // 'pecas' removido da chamada
console.log(faturaStr);