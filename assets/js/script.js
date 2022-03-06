


// ACESSANDO O ELEMENTO
let c = (el)=> document.querySelector(el);
let cs = (el)=> document.querySelectorAll(el);

// REGISTRAR DADO NO LOCALSTORAGE
function registrarLocalStorage(chave, objeto) {
    memoria = JSON.parse(localStorage[chave])
    memoria.push(objeto)
    localStorage.setItem(chave, JSON.stringify(memoria))
}

// FECHAR ALGO COM CLIQUE EM ALGO
function fechamento(button, elemento){
    c(button).addEventListener('click', ()=> {
        c(elemento).style.display = 'none'
        c('.fundo--escuro').style.display = 'none'
    })
}
// ABRIR ALGO COM CLIQUE EM ALGO
function abertura(button, elemento) {
    c(button).addEventListener('click', ()=> {
        c(elemento).style.display = 'flex'
        c('.fundo--escuro').style.display = 'block'
    })
}






// PREENCHENDO TELA INICIAL



// Data do header
c('.data--atual').innerHTML = `${diaAtual}/${mesAtual}/${anoAtual}`
cs('[type="date"]').forEach((item)=> {
    item.value = dataFormatada
})

// mostra o mês atual no painel de dados rápidos 
c('.card--info h2').innerHTML = descobrirMes(mesAtual)


let saldoDinheiro = 0
let saldoConta = 0


// calculando e preenchendo saldo atual
function calcularSaldoAtual() {
    saldoDinheiro = 0
    saldoConta = 0
    let lancamento = JSON.parse(localStorage.lancamentos)
    lancamento.forEach((item)=> {
        if(item.meio == 'dinheiro') {
            saldoDinheiro +=  parseFloat(item.valor)
        }
        if(item.meio == 'pix' || item.meio == 'cartão' || item.meio == 'transferência') {
            saldoConta += parseFloat(item.valor)
        }
    })
    cs('.valor--fisico')[0].innerHTML = `R$ ${saldoDinheiro.toFixed(2)}`
    // conta separada
    cs('.valor--fisico')[1].innerHTML = `R$ ${saldoDinheiro.toFixed(2)}`
    c('.valor--banco').innerHTML = `R$ ${saldoConta.toFixed(2)}`
    

}





//  RELATÓRIO

// abrir modal
abertura('.card--btn-relatorio', '.modal-relatorio')
fechamento('.modal-relatorio i', '.modal-relatorio')

// Adicionando despesas
function adicionarDespesasRelatorio(id) {
    let lista = []
    let novaLista = []
    let dados = JSON.parse(localStorage.lancamentos)
    dados.map((item)=> {
        if(item.tipo == 'SAÍDA' && item.data.substring(0,7) == id){
            lista.push(item.categoria)
            novaLista = lista.filter((este, i) => lista.indexOf(este) === i)
        }
    })


    c('.area--relatorio-despesa').innerHTML = ''
    // passa pela lista de categorias lançadas no período sem repetição
    let listaOrdenadaCategoria = []
    novaLista.map((item)=> {
        let soma = 0
        dados.forEach((i)=> {
            if(i.categoria == item && i.data.substring(0,7) == id) {
                if(i.tipo == 'SAÍDA') {
                    soma += parseFloat(i.valor)
                }
            }
        })
        listaOrdenadaCategoria.push({item, soma})
        // lista decrescente das categorias
        listaOrdenadaCategoria.sort(function(x,y) {
            return x.soma - y.soma
        })

    })
    let nomesGrafico = []
    let valoresGrafico = []
    listaOrdenadaCategoria.map((itemLista)=> {
        // separando valores para colocar no gráfico
        
        nomesGrafico.push(itemLista.item)
        valoresGrafico.push(itemLista.soma)

        // carrega as despesas na tela
        let linha = c('.modelo--clone-linha-despesa .linha--despesa').cloneNode(true)
        linha.querySelector('p').innerHTML = itemLista.item
        linha.querySelector('span').innerHTML = `R$ ${parseFloat(itemLista.soma).toFixed(2)*(-1)}`
        c('.area--relatorio-despesa').appendChild(linha)
    })

    // mostrar gráfico

    if(nomesGrafico.length > 0) {

        data = {
            datasets: [{
                data: valoresGrafico,
                backgroundColor: [
                '#df3934',
                '#f19c2d',
                '#e5e916',
                '#5ae947',
                '#3180e9',
                '#9531e7',
                '#e638c9',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373',
                '#837373'
                ]
            }],
    
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: nomesGrafico
        };

        

        let config = {
            type: 'doughnut',
            data: data,
        };
    
        myChart = new Chart(
            document.querySelector('.myChart'),
            config

        );

    } 
       

}


// carregar as datas do relatório
function carregarDatas() {
    let array = []
    c('.tabela-relatorio tbody').innerHTML = '';
    
    let dados = JSON.parse(localStorage.lancamentos)
    dados.forEach((item)=> {
        array.push(item.data.substring(0, 7))
        // array contendo os meses que tiveram registro
        novaArr = array.filter((este, i) => array.indexOf(este) === i);
    })

    
    // definindo os dados em cada data
    let valores = [];
    if(array.length > 0) {
        novaArr.map((item, index)=> {
            let saldoAtualConta = 0;
            let saldoAtualDinheiro = 0;
            let totalReceita = 0;
            let totalFaturamento = 0;
            let totalDespesa = 0;
            let totalLucro = 0;
            let totalServico = 0;
            dados.forEach((i)=> {
                let data = i.data.substring(0, 7)
                if(data == item && i.tipo == 'ENTRADA') {
                    totalReceita += parseFloat(i.valor)
                } else if (data == item && i.tipo == 'SAÍDA') {
                    totalDespesa += parseFloat(i.valor)*(-1)
                } else if (data == item && i.tipo == 'serviços') {
                    totalServico += parseFloat(i.valor)
                } 

                if(data == item) {
                    if(i.tipo == 'credito' || i.tipo == 'debito' || i.tipo == 'ENTRADA' && i.meio != 'cartão') {
                        totalFaturamento += parseFloat(i.valor)
                    }
                }
            })
            dados.forEach((item2)=> {
                if (item2.meio == 'dinheiro') {
                    saldoAtualDinheiro +=  parseFloat(item2.valor)
                } else if (item2.meio == 'pix' || item2.meio == 'cartão' || item2.meio == 'transferência') {
                    saldoAtualConta += parseFloat(item2.valor)
                }
            })

            totalLucro = totalReceita - totalDespesa

    
            // adicionando saldo atual
            cs('.box-relatorio span')[0].innerHTML = `R$ ${saldoAtualConta.toFixed(2)}`
            cs('.box-relatorio span')[1].innerHTML = `R$ ${saldoAtualDinheiro.toFixed(2)}`


            // salva os dados de cada mês em uma array
            valores.push([item, `R$ ${totalReceita.toFixed(2)}`, `R$ ${totalFaturamento.toFixed(2)}`, `R$ ${totalDespesa.toFixed(2)}`, `R$ ${totalLucro.toFixed(2)}`, totalServico])
    
            // Adiciona os meses com os dados
            let linha = document.createElement('tr')
            valores[index].forEach((itemID)=> {
                let celula = document.createElement('td')
                celula.innerHTML = itemID
                linha.appendChild(celula)
                // ABRIR O MODAL COM RELATÓRIO COMPLETO
                linha.addEventListener('click', ()=> {
                    c('.modal--relatorio-completo').style.display = 'flex'
                    // pegando o mês por extenso
                    let mesDoRelatorio = descobrirMes(item.substring(5, 7))
                    // escrevendo no modal o mês
                    c('.mes--relatorio').innerHTML = mesDoRelatorio 
                    // adicionando o saldo atual
                    c('.box--saldo-atual span').innerHTML = `R$ ${(parseFloat(saldoDinheiro) + parseFloat(saldoConta)).toFixed(2)}`

                    // adiciondo os valores

                    for(let i = 2; i<7; i++) {
                        cs('.box-relatorio span')[i].innerHTML = valores[index][i-1]
                    }

                    adicionarDespesasRelatorio(item)

                })
                // fechar modal clicando no titulo
                cs('.modal--relatorio-completo h2')[0].addEventListener('click', ()=> {
                    c('.modal--relatorio-completo').style.display = 'none'
                    myChart.destroy()
                })
            })
            c('.tabela-relatorio tbody').appendChild(linha)
        })
    }
    
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
        if(item.data.substring(7, 0) == anoMes) {
            if(item.tipo == 'ENTRADA') {
                totalReceita += parseFloat(item.valor)
            } else if (item.tipo == 'SAÍDA') {
                totalDespesa += parseFloat(item.valor)
            } else if (item.tipo == 'serviços') {
                totalServico += parseFloat(item.valor)
            }    
        } 
        if (item.data.substring(7, 0) == anoMes) {
            if(item.tipo == 'credito' || item.tipo == 'debito' || item.tipo == 'ENTRADA' && item.meio != 'cartão') {
                if(item.tipo != 'entrada n/ operacional' && item.tipo != 'saída n/ operacional') {
                    totalFaturamento += parseFloat(item.valor)
                    console.log(item.data.substring(7, 0)+' '+anoMes)
                }
            }
        }
    })


    totalLucro = totalDespesa*(-1) - totalReceita
    c('.info-receita span').innerHTML = `R$ ${totalReceita.toFixed(2)}`
    c('.info-faturamento span').innerHTML = `R$ ${totalFaturamento.toFixed(2)}`
    c('.info-despesa span').innerHTML = `R$ ${totalDespesa.toFixed(2)*(-1)}`
    c('.info-lucro span').innerHTML = `R$ ${totalLucro.toFixed(2)*(-1)}`
    c('.info-servico span').innerHTML = totalServico
}

atualizarDadosPainelInfo()


calcularSaldoAtual()






// CONTAS 




// Mostrar contas que vencem no dia


function mostrarContasDia() {
    let contas = JSON.parse(localStorage.contasAP)
    c('.area--avisos').innerHTML = ''
    contas.map((item, index)=> {
        if(item.data == dataFormatada) {
            c('.area--avisos').style.display = 'flex'
            let model = c('.model--aviso').cloneNode(true)
            model.querySelectorAll('span')[0].innerHTML = item.nome
            let valor = `R$ ${parseFloat(item.valor).toFixed(2)}`
            model.querySelectorAll('span')[1].innerHTML = valor
            model.querySelectorAll('span')[2].style.display = 'none'
            model.querySelectorAll('span')[3].innerHTML = item.data
            model.querySelector('i').setAttribute('data-key', index)
            model.querySelector('i').addEventListener('click', ()=> {
                contas.splice(index, 1)
                model.style.display = 'none'
                localStorage.contasAP = JSON.stringify(contas)
                registrarLocalStorage('lancamentos', {
                    edit: '<i class="ri-pencil-fill"></i>',
                    data: item.data,
                    tipo: 'SAÍDA',
                    categoria: item.nome,
                    detalhes: '',
                    meio: 'transferência',
                    valor: item.valor,
                    x: 'X'
                })
                atualizarDadosPainelInfo()
                atualizarDadosNaTela()
                calcularSaldoAtual()
                mostrarContasDia()
            })
            c('.area--avisos').append(model)
        }
    })
    if(c('.area--avisos').innerHTML == '') {
        c('.card--avisos p').style.display = 'flex'
    } else {
        c('.card--avisos p').style.display = 'none'
    }
}

mostrarContasDia()




// LANÇAMENTO

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
                        atualizarDadosNaTela()
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
    c('.fundo--escuro').style.display = 'block'
    c('.painel--lancamento-valor').focus()

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



// ATUALIZAR DADOS
function atualizarDadosNaTela(){
    // atualiza o saldo atual
    calcularSaldoAtual()
    // atualiza os lançamentos na tela
    carregarLancamentos()
    // atualiza o painel com informações rápidas do mês
    atualizarDadosPainelInfo()
}


// Lançamento normal
c('.lancamento--geral').addEventListener('click', ()=> {
    let data = c('.painel--lancamento-data').value
    let tipo = c('.painel--lancamento-tipo').value
    let categoria = c('.painel--lancamento-categoria').value
    let detalhes = c('.painel--lancamento-detalhes').value
    let meio = c('.painel--lancamento-meio').value
    let valor = c('.painel--lancamento-valor').value
    
    if(valor > 0) {
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
        atualizarDadosNaTela()
        
        c('.painel--lancamento-data').value = dataFormatada
        c('.painel--lancamento-tipo').value = 'ENTRADA'
        c('.box--categoria').innerHTML = ''
        entradas.map((i) => {
            let element = document.createElement('option')
            element.innerHTML = i
            c('.box--categoria').appendChild(element)
        }) 
        c('.painel--lancamento-detalhes').value = ''
        c('.painel--lancamento-meio').value = 'dinheiro'
        c('.painel--lancamento-valor').value = ''
    } else {
        alert('O campo valor não aceita valores negativos, letras ou símbolos!')
    }

    


})






//  CARTÃO
// carregando bandeiras
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

// Evento para quando alterar o valor do cartão
c('.lancamento--cartao-valor').addEventListener('keyup', ()=> {
    calcularTaxa()
})



// LANÇAR CARTÃO
c('.lancamento--cartao-lancar').addEventListener('click', ()=> {
    let valor = c('.lancamento--cartao-valor').value
    if(valor>0) {
        let data = c('.lancamento--cartao-data').value
        let tipo = c('.lancamento--cartao-tipo').value
        let categoria = c('.lancamento--cartao-bandeira').value
        let detalhes = valor-novoValor
        valor = (parseFloat(valor) - detalhes).toFixed(2)
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
        atualizarDadosNaTela()
    } else {
        alert('O campo valor não aceita valores negativos, letras ou símbolos!')
    }
})





//  LANÇAR SERVIÇO

c('.lancamento-servico-valor').addEventListener('change', ()=> {
    let valor = c('.lancamento-servico-valor').value
    if (valor > 0) {
        let dado = JSON.parse(localStorage.lancamentos)
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
    
        atualizarDadosNaTela()
    } else {
        alert('O campo valor não aceita valores negativos, letras ou símbolos!')
    }
  
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
                        c('.area--avisos').innerHTML = ''
                        mostrarContasDia()
                    }
                })
            }
        })
        tabela.appendChild(linha)
    })
}





// fechar o modal de contas
fechamento('.modal--contas .ri-close-circle-line', '.modal--contas')


// Listando as contas no select
c('.card--btn-contas').addEventListener('click', ()=>{
    c('.modal--contas').style.display = 'flex'
    c('.fundo--escuro').style.display = 'block'
    c('.painel--lancar-conta .box select').innerHTML = ''
    c('.modal--contas-valor').focus()

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


// registrando conta
c('.painel--lancar-conta button').addEventListener('click', ()=> {
    let nome = c('.painel--lancar-conta select').value
    let data = c('.painel--lancar-conta [type="date"]').value
    let valor = cs('.painel--lancar-conta input')[1].value
    valor = '-'+valor

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
    c('.area--avisos').innerHTML = ''
    mostrarContasDia()
})





//  ABRIR FACILITADOR DE NTF


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

// fechar modal
c('.modal--separador i').addEventListener('click', ()=> {
    c('.modal--separador').style.display = 'none'
    c('.fundo--escuro').style.display = 'none'
})

// carregar valores
function carregarValorSeparacao() {
    let dado = JSON.parse(localStorage.separacao)
    c('.barra--separador-principal span').innerHTML = 'R$ '+ dado[0].principal
    c('.barra--separador-local1 span').innerHTML = 'R$ '+ dado[0].local1
}




function carregarTotalSeparacao() {
    let dado = JSON.parse(localStorage.separacao)
    let n1 = dado[0].principal
    let n2 = dado[0].local1
    let total = parseFloat(n1) + parseFloat(n2)
    total = `R$ ${parseFloat(total).toFixed(2)}`
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
        let total = parseFloat(dado[0].principal) + parseFloat(valor)
        dado[0].principal = total.toFixed(2)
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
        let total = parseFloat(dado[0].local1) + parseFloat(valor)
        dado[0].local1 = total.toFixed(2)
        localStorage.setItem('separacao', JSON.stringify(dado))
    }
    carregarValorSeparacao()
    carregarTotalSeparacao()
    c('.barra--separador-local1 input').value = ''
})

c('.modal--separador button').addEventListener('click', ()=> {
    let dado = JSON.parse(localStorage.separacao)
    let total = parseFloat(dado[0].local1) + 100
    dado[0].local1 = total.toFixed(2)
    localStorage.setItem('separacao', JSON.stringify(dado))
    carregarValorSeparacao()
    carregarTotalSeparacao()
})

c('.barra--dinheiro-fisico').addEventListener('click', ()=>{
    c('.modal--separador').style.display = 'flex'
    c('.fundo--escuro').style.display = 'flex'
    carregarValorSeparacao()
    carregarTotalSeparacao()
})



// ao clicar o fundo some
c('.fundo--escuro').addEventListener("click", ()=> {
    cs('.modal').forEach((item)=> {
        item.style.display = 'none'
    })
    c('.fundo--escuro').style.display = 'none'
})