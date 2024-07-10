async function buscarDiscos() {
    const resposta = await fetch('http://localhost:3000/discos');
    const respostaConvertida = await resposta.json();
    return respostaConvertida;
}

const listaCards = document.querySelector('[data-lista]');

function constroiCard(id, nome, artista, imagem, preco) {
    const card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = `<div>
    <img class='card-img' alt= 'capa do álbum' src='${imagem}'>
    <h3>${nome}</h3>
    <h4>${artista}</h4>
    <div class='card-preco-icone'>
    <h5>$ ${preco.toFixed(2)}</h5>
    <img src='/img/icon-trash.png' alt='icone deletar' class='card-botao-lixo' id=${id} width='24px' height='24px'>
    </div>
    </div>`

    return card;
}

async function listaDiscos() {
    try {
        const listaDiscos = await buscarDiscos();
        if (listaDiscos.length == 0) {
            listaCards.innerHTML = `<p class='mensagem'>A lista de discos está vazia.</p>`;
        } else {
            listaDiscos.forEach(disco => listaCards.appendChild(constroiCard(disco.id, disco.nome, disco.artista, disco.imagem, disco.preco)));
        }
    } catch {
        listaCards.innerHTML = `<p class='mensagem'>Não foi possível carregar a lista de discos.</p>`;
    }
}

async function criaProduto(nome, artista, imagem, preco) {
    const resposta = await fetch('http://localhost:3000/discos', { method: 'post', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nome: nome, artista: artista, imagem: imagem, preco: preco }) });

    if (!resposta.ok) {
        throw new Error('Não foi possível enviar o disco.')
    }

    const respostaConvertida = await resposta.json();
    return respostaConvertida;
}

const botaoGuardar = document.querySelector('.botao-guardar');

async function criaDisco(evento) {
    evento.preventDefault();
    const nome = document.querySelector('[data-nome]').value;
    const artista = document.querySelector('[data-artista]').value;
    const imagem = document.querySelector('[data-imagem]').value;
    const preco = Number(document.querySelector('[data-preco]').value);

    if (nome == '' || artista == '' || imagem == '' || preco == '') {
        alert('Preencha todos os campos do formulário.');
        return;
    };

    try {
        await criaProduto(nome, artista, imagem, preco);
    } catch (e) {
        alert(e);
    }
}

botaoGuardar.addEventListener('click', evento => criaDisco(evento));

const botaoLimpar = document.querySelector('.botao-limpar');

function limpaCampos(evento) {
    evento.preventDefault();
    document.querySelector('[data-nome]').value = '';
    document.querySelector('[data-artista]').value = '';
    document.querySelector('[data-imagem]').value = '';
    document.querySelector('[data-preco]').value = '';
}

botaoLimpar.addEventListener('click', evento => limpaCampos(evento));

async function deletaCard(botaoLixo) {
    await fetch(`http://localhost:3000/discos/${botaoLixo.id}`, { method: 'delete', headers: { 'Content-type': 'application/json' } });
}

async function preencherTela() {
    await listaDiscos();
    const botoesLixo = document.querySelectorAll('.card-botao-lixo');
    botoesLixo.forEach(botaoLixo => botaoLixo.addEventListener('click', evento => deletaCard(evento.target)));
}

preencherTela();