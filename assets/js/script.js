const dataCompletaAtual = new Date();

let c = (el)=> document.querySelector(el);
let cs = (el)=> document.querySelectorAll(el);

// ================================================================ DATA
let diaAtual = 0;
let mesAtual = 0;
let anoAtual = 0;
let diaSemana = 0;

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

var diaMes = `${anoAtual}-${mesAtual}`














































// ================================================================

// PREENCHENDO TELA PRINCIPAL
// Dia
c('.data--atual').innerHTML = `${diaAtual}/${mesAtual}/${anoAtual}`
cs('[type="date"]').forEach((item)=> {
    item.value = dataFormatada
})

// mês atual (tela de dados rápidos)
c('.card--info h2').innerHTML = descobrirMes(mesAtual)

function fechamento(button, elemento){
    c(button).addEventListener('click', ()=> {
        c(elemento).style.display = 'none'
    })
}

function abertura(button, elemento) {
    c(button).addEventListener('click', ()=> {
        c(elemento).style.display = 'flex'
    })
}

// REGISTRAR DADO NO LOCALSTORAGE
function registrarLocalStorage(chave, objeto) {
    memoria = JSON.parse(localStorage[chave])
    memoria.push(objeto)
    localStorage.setItem(chave, JSON.stringify(memoria))
}


// PREENCHENDO SALDO ATUAL
function calcularSaldoAtual() {
    let saldoDinheiro = 0
    let saldoConta = 0
    let lancamento = JSON.parse(localStorage.lancamentos)
    lancamento.forEach((item)=> {
        if(item.meio == 'dinheiro') {
            saldoDinheiro +=  parseInt(item.valor)
        }
        if(item.meio == 'pix' || item.meio == 'cartão' || item.meio == 'transferência') {
            saldoConta += parseInt(item.valor)
        }
    })
    cs('.valor--fisico')[0].innerHTML = `R$ ${saldoDinheiro.toFixed(2)}`
    // conta separada
    cs('.valor--fisico')[1].innerHTML = `R$ ${saldoDinheiro.toFixed(2)}`
    c('.valor--banco').innerHTML = `R$ ${saldoConta.toFixed(2)}`
    

}



//  RELATÓRIO

// abrir modal

c('.card--btn-relatorio').addEventListener('click', ()=> {
    c('.modal-relatorio').style.display = 'flex'
})
fechamento('.modal-relatorio i', '.modal-relatorio')


// carregar as datas
function carregarDatas() {
    let array = []
    c('.tabela-relatorio tbody').innerHTML = '';
    
    let dados = JSON.parse(localStorage.lancamentos)
    dados.forEach((item)=> {
        array.push(item.data.substring(0, 7))
        // array contendo os meses que tiveram registro
        novaArr = array.filter((este, i) => array.indexOf(este) === i);
    })

    // mostrar dados na tabela
    
    //nova Arr ['2022-01', '2022-02', '2022-12']
    novaArr.map((item)=> {
        let totalReceita = 0;
        let totalFaturamento = 0;
        let totalDespesa = 0;
        let totalLucro = 0;
        let totalServico = 0;
        let valores = [];
        dados.forEach((i)=> {
            let data = i.data.substring(0, 7)
            if(data == item && i.tipo == 'ENTRADA') {
                totalReceita += parseInt(i.valor)
            } else if (data == item && i.tipo == 'credito' || i.tipo == 'debito') {
                totalFaturamento += parseInt(i.valor)
            } else if (data == item && i.tipo == 'SAÍDA') {
                totalDespesa += parseInt(i.valor)*(-1)
            } else if (data == item && i.tipo == 'serviços') {
                totalServico += parseInt(i.valor)
            }
        })
        totalFaturamento += totalReceita
        totalLucro = totalFaturamento - totalDespesa
        console.log(`Data: ${item} / Receita: ${totalReceita} / Faturamento: ${totalFaturamento} / Despesa: ${totalDespesa} / Lucro: ${totalLucro} / Serviços: ${totalServico}`)

        valores = [item, `R$ ${totalReceita.toFixed(2)}`, `R$ ${totalFaturamento.toFixed(2)}`, `R$ ${totalDespesa.toFixed(2)}`, `R$ ${totalLucro.toFixed(2)}`, totalServico]

        let linha = document.createElement('tr')
        valores.forEach((itemID)=> {
            let celula = document.createElement('td')
            celula.innerHTML = itemID
            linha.appendChild(celula)  
        })
        c('.tabela-relatorio tbody').appendChild(linha)
    })
}

carregarDatas()


// Mostrar dados do mês do painel de informações rápidas
function atualizarDadosPainelInfo() {
    let dados = JSON.parse(localStorage.lancamentos)
    let totalReceita = 0;
    let totalFaturamento = 0;
    let totalDespesa = 0;
    let totalServico = 0;
    let totalLucro = 0;
    dados.map((item)=> {
        if(item.data.substring(7, 0) == diaMes) {
            if(item.tipo == 'ENTRADA') {
                totalReceita += parseInt(item.valor)
            } else if (item.tipo == 'credito' || item.tipo == 'debito') {
                totalFaturamento += parseInt(item.valor)
            } else if (item.tipo == 'SAÍDA') {
                totalDespesa += parseInt(item.valor)
            } else if (item.tipo == 'serviços') {
                totalServico += parseInt(item.valor)
            }
        }
    })
    totalFaturamento += totalReceita
    totalLucro = totalDespesa*(-1) - totalFaturamento
    c('.info-receita span').innerHTML = `R$ ${totalReceita.toFixed(2)}`
    c('.info-faturamento span').innerHTML = `R$ ${totalFaturamento.toFixed(2)}`
    c('.info-despesa span').innerHTML = `R$ ${totalDespesa.toFixed(2)*(-1)}`
    c('.info-lucro span').innerHTML = `R$ ${totalLucro.toFixed(2)*(-1)}`
    c('.info-servico span').innerHTML = totalServico
}

atualizarDadosPainelInfo()


calcularSaldoAtual()


// ======================================== AVISOS ==============================================

fechamento('.modal--adicionar--avisos .ri-close-circle-line','.modal--adicionar--avisos')




// Verificar se tem aviso
function verificarAvisos() {
    let memoria = JSON.parse(localStorage.avisos)
    memoria.map((item, index)=> {
        if (item.data==dataFormatada) {
            c('.area--avisos').style.display = 'flex'
            let model = c('.model--aviso').cloneNode(true)
            model.querySelectorAll('span')[0].innerHTML = item.nome
            model.querySelectorAll('span')[1].innerHTML = item.detalhes
            model.querySelectorAll('span')[2].innerHTML = item.repeticao
            model.querySelectorAll('span')[3].innerHTML = item.data
            model.querySelector('i').setAttribute('data-key', index)
            model.querySelector('i').addEventListener('click', ()=> {
                memoria.splice(index, 1)
                model.style.display = 'none'
                localStorage.avisos = JSON.stringify(memoria)
            })
            c('.area--avisos').append(model)
        } 
    })

}



// Mostrar contas que vencem no dia
function mostrarContasDia() {
    // verificarAvisos()
    let contas = JSON.parse(localStorage.contasAP)
    contas.map((item, index)=> {
        if(item.data == dataFormatada) {
            c('.area--avisos').style.display = 'flex'
            let model = c('.model--aviso').cloneNode(true)
            model.style.backgroundColor = 'orange'
            model.querySelectorAll('span')[0].innerHTML = item.nome
            let valor = `R$ ${parseInt(item.valor).toFixed(2)}`
            model.querySelectorAll('span')[1].innerHTML = valor
            model.querySelectorAll('span')[2].style.display = 'none'
            model.querySelectorAll('span')[3].innerHTML = item.data
            model.querySelector('i').setAttribute('data-key', index)
            model.querySelector('i').addEventListener('click', ()=> {
                contas.splice(index, 1)
                model.style.display = 'none'
                localStorage.contasAP = JSON.stringify(contas)
            })
            c('.area--avisos').append(model)
        }
    })
}


function carregarItensAreaAvisos() {
    c('.area--avisos').innerHTML = ''
    mostrarContasDia()
    verificarAvisos()
}

carregarItensAreaAvisos()



// Carregar avisos 
function carregarAvisos() {
    c('.avisos--lancados tbody').innerHTML = ''
    let memoria = JSON.parse(localStorage.avisos)
    memoria.map((item, index)=>{
        let tabela = c('.avisos--lancados tbody')
        let linha = document.createElement('tr')

        Object.keys(item).forEach((element, i) => {
            let celula = document.createElement('td')
            celula.innerHTML = item[element]
            linha.appendChild(celula)
            if(i==4) {
                celula.addEventListener('click', ()=> {
                    memoria.splice(index, 1)
                    localStorage.setItem('avisos', JSON.stringify(memoria))
                    carregarItensAreaAvisos()
                    carregarAvisos()
                })
                
            }
        });
        tabela.appendChild(linha)
    })
    carregarItensAreaAvisos()
}

// Adicionar aviso
c('.painel--lancar-avisos button').addEventListener('click', ()=> {
    let nome = c('.box--lancar-nome input').value
    let detalhes = c('.box--lancar-nota textarea').value
    let repeticao = c('.box--lancar-repeticao select').value
    let data = c('.box--lancar-data input').value
    
    registrarLocalStorage('avisos', {nome, detalhes, repeticao, data, x:'X'})
    c('.box--lancar-nome input').value = ''
    c('.box--lancar-nota textarea').value = ''

    carregarAvisos()
    carregarItensAreaAvisos()
})



// Abrir e fechar modal add avisos
c('.adicionar--aviso').addEventListener('click', ()=> {
    c('.modal--adicionar--avisos').style.display = 'flex'
    carregarAvisos()
})

// ================================ LANÇAMENTO =========================================

fechamento('.modal--lancamentos i', '.modal--lancamentos')

// carregar lançamentos
function carregarLancamentos() {
    carregarDatas()
    c('.tabela--lancamento tbody').innerHTML = ''
    let lancamentos2 = JSON.parse(localStorage.lancamentos)
    lancamentos2.map((item, itemIndex)=> {
        let linha = document.createElement('tr')
        Object.keys(item).forEach((i, index)=> {
            let celula = document.createElement('td')
            if (item[i]=='ENTRADA' || item[i]=='entrada n/ operacional') {
                celula.style.backgroundColor = '#60e260'
            } else if (item[i]=='SAÍDA' || item[i]=='saída n/ operacional'){
                celula.style.backgroundColor = '#e26060' 
            }
            celula.innerHTML = item[i]
            linha.appendChild(celula)
            c('.tabela--lancamento tbody').appendChild(linha)
            
            if(index == 7) {
                celula.addEventListener('click', ()=> {
                    if(confirm('Tem certeza que quer apagar o registro?')) {
                        lancamentos2.splice(itemIndex, 1)
                        localStorage.setItem('lancamentos', JSON.stringify(lancamentos2))
                        carregarLancamentos()
                        calcularSaldoAtual()
                        atualizarDadosPainelInfo()
                    } 
                })
            }


            function preencherEdicaoLancamento() {
                // verificando tipo do editar dado
                let painel = c('.painel--editar-lancamento')
                let tipo = painel.querySelectorAll('select')[0]
                let categoria = painel.querySelectorAll('select')[1]

                // preenchendo os dados no modal
                painel.querySelectorAll('input')[0].value = lancamentos2[itemIndex].data
                painel.querySelectorAll('select')[0].value = lancamentos2[itemIndex].tipo


                // checagem de select para preenchimento automático
                function checarTipoEdit(){
                    if(tipo.value == 'SAÍDA') {
                        categoria.innerHTML = ''
                        saidas.forEach((i)=> {
                            let element = document.createElement('option')
                            element.innerHTML = i
                           categoria.appendChild(element)
                        })
                    } else if(tipo.value == 'ENTRADA') {
                        categoria.innerHTML = ''
                        entradas.forEach((i)=> {
                            let element = document.createElement('option')
                            element.innerHTML = i
                            categoria.appendChild(element)
                        }) 
                    } else if(tipo.value == 'entrada n/ operacional' || tipo.value ==  'saída n/ operacional') {
                        categoria.innerHTML = ''
                    }
                }
                checarTipoEdit()

                // preenchendo dados no modal para edição
                painel.querySelectorAll('select')[1].value = lancamentos2[itemIndex].categoria
                painel.querySelector('textarea').value = lancamentos2[itemIndex].detalhes
                painel.querySelectorAll('select')[2].value = lancamentos2[itemIndex].meio
                painel.querySelectorAll('input')[1].value = lancamentos2[itemIndex].valor

                tipo.addEventListener('change', ()=> {  
                    checarTipoEdit()
                        
                })  
                
                // Pegando dados novos e lançando
                c('.painel--editar-lancamento button').addEventListener('click', ()=> {
                    lancamentos2[itemIndex].data =  painel.querySelectorAll('input')[0].value
                    lancamentos2[itemIndex].tipo = painel.querySelectorAll('select')[0].value
                    lancamentos2[itemIndex].categoria = painel.querySelectorAll('select')[1].value
                    lancamentos2[itemIndex].detalhes = painel.querySelector('textarea').value 
                    lancamentos2[itemIndex].meio = painel.querySelectorAll('select')[2].value
                    lancamentos2[itemIndex].valor = painel.querySelectorAll('input')[1].value

                    localStorage.setItem('lancamentos', JSON.stringify(lancamentos2))
                    carregarLancamentos()
                    calcularSaldoAtual()
                    atualizarDadosPainelInfo()

                    // fechar modal de edição
                    c('.painel--editar-lancamento').style.display = 'none'
                })
            }

            // EDITAR DADO LANÇADO
            if(index == 0) {
                celula.addEventListener('click', ()=> {
                    c('.painel--editar-lancamento').style.display = 'flex'
                    preencherEdicaoLancamento()
                })
            }

        })
       
    })
}

// Abrir modal de lançamento
c('.card--btn-lancamento').addEventListener('click', ()=> {
    c('.modal--lancamentos').style.display = 'flex'
    c('.box--categoria').innerHTML = ''
    carregarLancamentos()

    // LISTANDO CATEGORIAS AO ABRIR
    entradas.map((i)=> {
        let element = document.createElement('option')
        element.innerHTML = i
        c('.box--categoria').appendChild(element)
    }) 


    // Verificação de tipos
    c('.box--tipo').addEventListener('change', (item)=> {
        if(item.target.value == 'SAÍDA') {
            c('.box--categoria').innerHTML = ''
            saidas.map((i)=> {
                let element = document.createElement('option')
                element.innerHTML = i
                c('.box--categoria').appendChild(element)
            })
        } else if(item.target.value == 'ENTRADA') {
            c('.box--categoria').innerHTML = ''
            entradas.map((i)=> {
                let element = document.createElement('option')
                element.innerHTML = i
                c('.box--categoria').appendChild(element)
            }) 
        } else if(item.target.value == 'entrada n/ operacional' || item.target.value ==  'saída n/ operacional') {
            c('.box--categoria').innerHTML = ''
        }
    })

    

})

// Lançamento normal
c('.lancamento--geral').addEventListener('click', ()=> {
    let data = c('.painel--lancamento-data').value
    let tipo = c('.painel--lancamento-tipo').value
    let categoria = c('.painel--lancamento-categoria').value
    let detalhes = c('.painel--lancamento-detalhes').value
    let meio = c('.painel--lancamento-meio').value
    let valor = c('.painel--lancamento-valor').value
    tipo == 'SAÍDA'|| tipo == 'saída n/ operacional'? valor = '-'+valor : valor = valor

    registrarLocalStorage('lancamentos', {
        edit: '<i class="ri-pencil-fill"></i>',
        data,
        tipo,
        categoria,
        detalhes,
        meio, 
        valor, 
        x: 'X'
    })
    calcularSaldoAtual()
    carregarLancamentos()
    atualizarDadosPainelInfo()
})



// Lançamento de cartão

bandeiraCredito.map((item)=> {
    let e = document.createElement('option')
    e.innerHTML = item
    c('.lancamento--cartao-bandeira').appendChild(e)
})

// Adicionando bandeira com base no tipo
c('.lancamento--cartao-tipo').addEventListener('change', ()=> {
    let elemento = c('.lancamento--cartao-tipo').value
    let elemento2 = c('.lancamento--cartao-bandeira')
    elemento2.innerHTML = ''
    if(elemento == 'credito') {
        bandeiraCredito.map((item)=> {
            let e = document.createElement('option')
            e.innerHTML = item
            elemento2.appendChild(e)
        })
    } else {
        bandeiraDebito.map((item)=> {
            let e = document.createElement('option')
            e.innerHTML = item
            elemento2.appendChild(e)

        })
    }
})

//Calcular taxas
let novoValor
function calcularTaxa(){
    let tipo = c('.lancamento--cartao-tipo').value
    let bandeira = c('.lancamento--cartao-bandeira').value
    let modalidade = c('.lancamento--cartao-modalidade').value
    let ElementoMSG = c('.painel--lancamento-cartao p')
    let valor = c('.lancamento--cartao-valor').value
    if(tipo=='credito') {
        if(bandeira=='Elo') {  
            if(modalidade == 'À vista') {
                novoValor = (4.09*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (4.09% de taxa)` 
            } else if (modalidade < 7) {
                novoValor = (4.62*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (4.62% de taxa)` 
            } else {
                novoValor = (5.09*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (5.09% de taxa)`
            }          
        } else {
            if(modalidade == 'À vista') {
                novoValor = (3.40*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (3.40% de taxa)` 
            } else if (modalidade < 7) {
                novoValor = (3.91*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (3.91% de taxa)` 
            } else {
                novoValor = (4.17*valor/100-valor)*(-1)
                ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (4.17% de taxa)`
            }
        }
    } else {
        if (bandeira == 'Mastercard' || bandeira == 'Visa') {
            novoValor = (1.86*valor/100-valor)*(-1)
            ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (1.86% de taxa)`
        } else if (bandeira == 'Elo') {
            novoValor = (3.04*valor/100-valor)*(-1)
            ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (3.04% de taxa)`
        } else if (bandeira == 'Cabal') {
            novoValor = (1.51*valor/100-valor)*(-1)
            ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (1.51% de taxa)`
        } else {
            novoValor = (0*valor/100-valor)*(-1)
            ElementoMSG.innerHTML = `Você receberá ${novoValor.toFixed(2)} (0% de taxa)`
        }
    }
}

// Evento para quando algum item for alterado
cs('.painel--lancamento-cartao select').forEach((item)=> {
    item.addEventListener('change', ()=> {
        calcularTaxa()
    })
})

// Evento para quando alterar o valor
c('.lancamento--cartao-valor').addEventListener('keyup', ()=> {
    calcularTaxa()
})

// LANÇAR CARTÃO
c('.lancamento--cartao-lancar').addEventListener('click', ()=> {
    let data = c('.lancamento--cartao-data').value
    let tipo = c('.lancamento--cartao-tipo').value
    let categoria = c('.lancamento--cartao-bandeira').value
    let valor = c('.lancamento--cartao-valor').value
    let detalhes = valor-novoValor
    detalhes = detalhes.toFixed(2)
    let meio = c('.lancamento--cartao-modalidade').value
    tipo == 'SAÍDA'|| tipo == 'saída n/ operacional'? valor = '-'+valor : valor = valor;

    registrarLocalStorage('lancamentos', {
        edit: '<i class="ri-pencil-fill"></i>',
        data,
        tipo,
        categoria,
        detalhes,
        meio, 
        valor, 
        x: 'X'
    })
    calcularSaldoAtual()
    carregarLancamentos()
    atualizarDadosPainelInfo()
})
























// LANÇAR SERVIÇO

c('.lancamento-servico-valor').addEventListener('change', ()=> {
    let dado = JSON.parse(localStorage.lancamentos)
    let valor = c('.lancamento-servico-valor').value
    c('.lancamento-servico-valor').value = ''
    let data = c('.lancamento-servico-data').value
    dado.push({
        edit: '<i class="ri-pencil-fill"></i>',
        data,
        tipo: 'serviços',
        x2: '',
        x3: '',
        x4: '',
        valor,
        x: 'X'
    })
    localStorage.setItem('lancamentos', JSON.stringify(dado))

    carregarLancamentos()
    atualizarDadosPainelInfo()
})























// CONTAS A PAGAR

// listar as contas na tabela
function listarContasAP(){
    let contasSalvas = JSON.parse(localStorage.contasAP)
    let tabela = c('.modal--contas table tbody')
    tabela.innerHTML = ''
    contasSalvas.map((item, indexItem)=> {
        let linha = document.createElement('tr')
        Object.keys(item,).forEach((i, index)=> {
            let celula = document.createElement('td')
            celula.innerHTML = item[i]
            linha.appendChild(celula)

            if(index == 4) {
                celula.addEventListener('click', ()=> {
                    if(confirm('Deseja mesmo apagar essa conta?')){
                        contasSalvas.splice(indexItem, 1)
                        localStorage.setItem('contasAP', JSON.stringify(contasSalvas)) 
                        listarContasAP()
                    }
                })
            }
        })
        tabela.appendChild(linha)
    })
}




























// fechar o modal de contas
fechamento('.modal--contas .ri-close-circle-line', '.modal--contas')

c('.card--btn-contas').addEventListener('click', ()=>{
    c('.modal--contas').style.display = 'flex'
    c('.painel--lancar-conta .box select').innerHTML = ''

    // Listando as contas no select
    contas.map((item)=> {
        let elemento = document.createElement('option')
        elemento.innerHTML = item
        c('.painel--lancar-conta .box select').appendChild(elemento)
    })
    listarContasAP()
})


// Mostrando data da conta escolhida
c('.painel--lancar-conta .box select').addEventListener('change', (item)=> {
    let parteDataAtual = `${anoAtual}-${mesAtual}-`
    let elemento = item.target.value
    if( elemento == 'Água') {
        cs('.painel--lancar-conta input')[0].value = parteDataAtual + '07'
    } else if ( elemento == 'Luz') {
        cs('.painel--lancar-conta input')[0].value = parteDataAtual + '27'
    } else if ( elemento == 'Internet/telefone' || elemento == 'SIMPLES') {
        cs('.painel--lancar-conta input')[0].value = parteDataAtual + '20'
    } else if ( elemento == 'IPTU') {
        cs('.painel--lancar-conta input')[0].value = ''
    } else if ( elemento == 'Aluguel') {
        cs('.painel--lancar-conta input')[0].value = parteDataAtual + '10'
    }
})


c('.painel--lancar-conta button').addEventListener('click', ()=> {
    let nome = c('.painel--lancar-conta select').value
    let data = c('.painel--lancar-conta [type="date"]').value
    let valor = cs('.painel--lancar-conta input')[1].value

    let lancamentoContas = JSON.parse(localStorage.contasAP)
    lancamentoContas.push({
        edit: '<i class="ri-pencil-fill"></i>',
        nome,
        data,
        valor,
        x: 'X'
    })
    localStorage.setItem('contasAP', JSON.stringify(lancamentoContas)) 
    listarContasAP()
    carregarItensAreaAvisos()
})



// ABRIR FACILITADOR DE NTF
c('.card--btn-ntf').addEventListener('click', ()=> {
    window.open('assets/Notas_fiscais_facilitador2/index.html', '_blank');
    window.open('assets/Notas_fiscais_facilitador2/index.html', '_blank');
  
})



// SEPARADOR DE DINHEIRO

let dado = JSON.parse(localStorage.separacao)
if(dado.length == 0) {
    dado.push({
        principal: 0,
        local1: 0
    })
    localStorage.setItem('separacao', JSON.stringify(dado))
}

c('.modal--separador i').addEventListener('click', ()=> {
    c('.modal--separador').style.display = 'none'
})

// carregar valores
function carregarValorSeparacao() {
    let dado = JSON.parse(localStorage.separacao)
    c('.barra--separador-principal span').innerHTML = dado[0].principal
    let dado2 = JSON.parse(localStorage.separacao)
    c('.barra--separador-local1 span').innerHTML = dado2[0].local1
}

carregarValorSeparacao()

function carregarTotalSeparacao() {
    let n1 = c('.barra--separador-principal span').innerHTML
    let n2 = c('.barra--separador-local1 span').innerHTML
    let total = parseInt(n1) + parseInt(n2)
    total = `R$ ${parseInt(total).toFixed(2)}`
    c('.modal--separador p').innerHTML = total
    let totalDinheiro = c('.valor--fisico').innerHTML
    if(total == totalDinheiro) {
        c('.modal--separador p').style.color = '#000'
    } else {
        c('.modal--separador p').style.color = 'red'
    }
}

carregarTotalSeparacao()

c('.barra--separador-principal input').addEventListener('change', (i)=> {
    let valor = i.target.value
    let dado = JSON.parse(localStorage.separacao)
    if(dado.length == 0) {
        dado.push({
            principal: valor,
            local1: 0
        })
        localStorage.setItem('separacao', JSON.stringify(dado))
    } else {
        let total = parseInt(dado[0].principal) + parseInt(valor)
        dado[0].principal = total
        localStorage.setItem('separacao', JSON.stringify(dado))
    }
    carregarValorSeparacao()
    carregarTotalSeparacao()
    c('.barra--separador-principal input').value = ''
})

c('.barra--separador-local1 input').addEventListener('change', (i)=> {
    let valor = i.target.value
    let dado = JSON.parse(localStorage.separacao)
    if(dado.length == 0) {
        dado.push({
            principal: 0,
            local1: valor
        })
        localStorage.setItem('separacao', JSON.stringify(dado))
    } else {
        let total = parseInt(dado[0].local1) + parseInt(valor)
        dado[0].local1 = total
        localStorage.setItem('separacao', JSON.stringify(dado))
    }
    carregarValorSeparacao()
    carregarTotalSeparacao()
    c('.barra--separador-local1 input').value = ''
})

c('.barra--separador-local1 button').addEventListener('click', ()=> {
    let dado = JSON.parse(localStorage.separacao)
    let total = parseInt(dado[0].local1) + 100
    dado[0].local1 = total
    localStorage.setItem('separacao', JSON.stringify(dado))
    carregarValorSeparacao()
    carregarTotalSeparacao()
})

c('.barra--dinheiro-fisico').addEventListener('click', ()=>{
    c('.modal--separador').style.display = 'flex'
    carregarValorSeparacao()
    carregarTotalSeparacao()
})













































