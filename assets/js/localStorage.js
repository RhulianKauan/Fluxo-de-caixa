// Checagem e criação dos espaços no locastorage
function criarLocalStorage(){
    if(localStorage.avisos == undefined) {
        localStorage.setItem('avisos', '[]')
    }
    if(localStorage.relatorio == undefined) {
        localStorage.setItem('relatorio', '[]')
    }
    if(localStorage.anotacoes == undefined) {
        localStorage.setItem('anotacoes', '[]')
    }
    if(localStorage.lancamentos == undefined) {
        localStorage.setItem('lancamentos', '[]')
    }
    if(localStorage.contasAP == undefined) {
        localStorage.setItem('contasAP', '[]')
    }
    if(localStorage.separacao == undefined) {
        localStorage.setItem('separacao', '[]')
    } if(localStorage.datas == undefined) { // datas usadas para calcular o relatório
        localStorage.setItem('datas', '[]')
    }
};

criarLocalStorage()