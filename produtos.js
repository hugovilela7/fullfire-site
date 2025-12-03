const API_URL = "https://fullfire-backend.onrender.com";
const produtosContainer = document.getElementById("produtosContainer");

// Carrega produtos do backend
async function carregarProdutos() {
  try {
    const resposta = await fetch(`${API_URL}/produtos`);
    const produtos = await resposta.json();

    produtosContainer.innerHTML = "";

    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.className = "produto-card";
      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p><strong>R$ ${parseFloat(produto.preco).toFixed(2)}</strong></p>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
      `;
      produtosContainer.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    produtosContainer.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}

// Adiciona produto ao carrinho (localStorage)
function adicionarAoCarrinho(produtoId) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const itemExistente = carrinho.find(item => item.id === produtoId);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id: produtoId, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

// Inicia
carregarProdutos();