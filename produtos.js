const API_URL = "https://fullfire-backend.onrender.com";
const produtosContainer = document.getElementById("produtosContainer");

// NOVO: Variável global para armazenar a lista de produtos carregados
let produtosList = [];

// Carrega produtos do backend
async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API_URL}/produtos`);
        produtosList = await resposta.json(); // Armazena a lista na variável global

        produtosContainer.innerHTML = "";

        produtosList.forEach(produto => {
            const card = document.createElement("div");
            card.className = "produto-card";
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p><strong>R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</strong></p>
                <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
            `;
            produtosContainer.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        produtosContainer.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    }
}

// Adiciona produto ao carrinho (localStorage) - CORRIGIDA
function adicionarAoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    // 1. Encontra o produto COMPLETO na lista
    const produtoCompleto = produtosList.find(p => p.id === produtoId);

    if (!produtoCompleto) {
        console.error("Produto não encontrado na lista.");
        alert("Erro: Produto não disponível para adição.");
        return;
    }

    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        // 2. CORREÇÃO: Adiciona PREÇO, NOME, IMAGEM e ID
        carrinho.push({
            id: produtoCompleto.id,
            nome: produtoCompleto.nome,
            preco: parseFloat(produtoCompleto.preco), // Garante que o preço seja um número
            imagem: produtoCompleto.imagem,
            quantidade: 1 
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
    
    // Se o seu site usa um contador de itens no cabeçalho, você deve atualizar ele aqui.
    // window.dispatchEvent(new Event('storage')); // Se você usa um listener global
}

// Inicia
carregarProdutos();