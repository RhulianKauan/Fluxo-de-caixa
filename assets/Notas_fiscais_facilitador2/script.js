var inputs = document.querySelectorAll('.quantidade');
update();
let frase = ' // Percentual Aproximado dos tributos 6%';


function update() {
    let totalGeral = 0;

    servicos.map((item, index)=> {
        document.querySelectorAll('.quantidade')[index].setAttribute('placeholder', item.servico)  
        document.querySelectorAll('.preco')[index].innerHTML = `R$ ${item.valor}`
        let qt = document.querySelectorAll('.quantidade')[index].value
        let totalLinha = item.valor * qt
        document.querySelectorAll('.total')[index].innerHTML = `R$ ${totalLinha}` 
        
        totalGeral += totalLinha
        document.querySelector('.total--geral').innerHTML = `R$ ${totalGeral.toFixed()}`

        document.querySelector('.area--lancados').innerHTML = ''
        inputs.forEach((itemModal, indexModal)=> {
            if (itemModal.value > 0) {
                qt = document.querySelectorAll('.quantidade')[indexModal].value
                let valor = document.querySelectorAll('.total')[indexModal].innerHTML

                let servicoItem = document.querySelector('.box--servicos').cloneNode(true)
                if(itemModal.value > 1) {
                    servicoItem.querySelector('.servico--name').innerHTML = `${qt} ${servicos[indexModal].b} veículo ${servicos[indexModal].carro} ${frase}`
                } else {
                    servicoItem.querySelector('.servico--name').innerHTML = `${qt} ${servicos[indexModal].a} veículo ${servicos[indexModal].carro} ${frase}`
                }
                servicoItem.querySelector('.servico--value').innerHTML = valor
                document.querySelector('.area--lancados').append(servicoItem)
            }
        })
        let botao = document.querySelectorAll('.box--servicos button')
        botao.forEach((itemB, indexB)=> {
            let textoModal = document.querySelectorAll('.box--servicos .servico--name')[indexB].innerHTML
            itemB.addEventListener('click', ()=>{
                navigator.clipboard.writeText(textoModal)
                itemB.style.backgroundColor = 'rgb(42, 118, 218)'
                itemB.style.color = '#fff'
                itemB.innerHTML = 'COPIADO'
            })
        })
        let checkbox = document.querySelectorAll('.checkbox')
        let painel = document.querySelectorAll('.box--servicos')
        checkbox.forEach((itemC, indexC)=> {
            itemC.addEventListener('click', ()=> {
                painel[indexC].style.opacity = '20%'
            })
        })


    })
}

for(let i in inputs) {
    inputs[i].addEventListener('keyup', update)
}