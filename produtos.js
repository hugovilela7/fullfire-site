// Removida a constante API_URL, pois não buscaremos no backend por enquanto.
const produtosContainer = document.getElementById("produtosContainer");

// ==============================
// LISTA DE PRODUTOS FIXOS (HARDCODED)
// ==============================
let produtosList = [
    {
        id: 1,
        nome: "10 Caixas De Carvão 600 unidades - Full Fire",
        preco: 249.00,
        imagem: "https://seu-host.com/img/caixa12.jpg",
        descricao: "Carvão de coco premium Full Fire, alta duração."
    },
    {
        id: 2,
        nome: "Caixa com 60 unidades - Full Fire",
        preco: 26.00,
        imagem: "https://seu-host.com/img/caixa60.jpg",
        descricao: "Ideal para quem busca melhor custo-benefício."
    }
];

// ==============================
// FUNÇÃO PARA CARREGAR E RENDERIZAR OS PRODUTOS
// ==============================
function carregarProdutos() {
    // Usamos a lista local (produtosList) em vez de buscar na API
    
    produtosContainer.innerHTML = "";

    produtosList.forEach(produto => {
        const card = document.createElement("div");
        // Nota: Garanta que o estilo 'produto-card' esteja no seu style.css ou no HTML
        card.className = "produto-card"; 
        
        // Renderiza o preço com vírgula para visualização
        const precoFormatado = parseFloat(produto.preco).toFixed(2).replace('.', ',');
        
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p><strong>R$ ${precoFormatado}</strong></p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        produtosContainer.appendChild(card);
    });
    
    // Se a lista estiver vazia (embora improvável com dados fixos)
    if (produtosList.length === 0) {
         produtosContainer.innerHTML = "<p>Nenhum produto disponível.</p>";
    }
}

// ==============================
// FUNÇÃO ADICIONAR AO CARRINHO (A CHAVE PARA O CÁLCULO)
// ==============================
function adicionarAoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    // 1. Encontra o produto COMPLETO na lista fixa
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
        // 2. Adiciona todas as informações necessárias (ID, NOME, PREÇO, IMAGEM, QTD)
        carrinho.push({
            id: produtoCompleto.id,
            nome: produtoCompleto.nome,
            preco: parseFloat(produtoCompleto.preco), // O PREÇO É SALVO COMO NÚMERO
            imagem: produtoCompleto.imagem,
            quantidade: 1 
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
}

// Inicia o carregamento dos produtos assim que o script é lido
carregarProdutos();