const dataCompletaAtual = new Date();

let diaAtual = 0;
let mesAtual = 0;
let anoAtual = 0;
let diaSemana = 0;



// DEFININDO A DATA
function definindoData() {
    diaAtual = dataCompletaAtual.getDate() // DIA
    if(diaAtual <= 9) {
        diaAtual = '0' + diaAtual
    }
    mesAtual = dataCompletaAtual.getMonth()+1 // MÊS
    if(mesAtual <= 9) {
        mesAtual = '0' + mesAtual
    }
    anoAtual = dataCompletaAtual.getFullYear() // ANO
    diaSemana = dataCompletaAtual.getDay() // SEMANA (0-6)
}
definindoData()

// Passando um número como argumento para a função ela retorna a semana correspondente (0-6)
function  descobrirSemana(id) {
    let semana = 0
    switch (id) {
        case 0:
            semana = 'Domingo'
            break;
        case 1:
            semana = 'Segunda-feira'
            break;
        case 2:
            semana = 'Terça-feita'
            break;
        case 3:
            semana = 'Quarta-feira'
            break;
        case 4:
            semana = 'Quinta-feira'
            break;
        case 5:
            semana = 'Sexta-feira'
            break;

        default:
            semana = 'Sábado'
            break;
    }
    return semana
}
// (0-11)
function descobrirMes(id) {
    let mes = '' 
    switch (id) {
        case '01':
            mes = 'Janeiro';
            break;
        case '02':
            mes = 'Fevereiro';
            break;
        case '03':
            mes = 'Março';
            break;
        case '04':
            mes = 'Abril';
            break;
        case '05':
            mes = 'Maio';
            break;
        case '06':
            mes = 'Junho';
            break;
        case '07':
            mes = 'Julho';
            break;
        case '08':
            mes = 'Agosto';
            break;
        case '09':
            mes = 'Setembro';
            break;
        case '10':
            mes = 'Outubro';
            break;
        case '11':
            mes = 'Novembro';
            break;            
        default:
            mes = 'Dezembro';
            break;
    }
    return mes
}


let semanaAtual = descobrirSemana(diaSemana) // SEMANA

var dataFormatada = `${anoAtual}-${mesAtual}-${diaAtual}`

var anoMes = `${anoAtual}-${mesAtual}`
