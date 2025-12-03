const API_URL = "https://fullfire-backend.onrender.com";

// Carrega os produtos do backend
async function carregarProdutos() {
  try {
    const res = await fetch(`${API_URL}/produtos`);
    const produtos = await res.json();

    const container = document.getElementById("produtosContainer");
    container.innerHTML = "";

    produtos.forEach(produto => {
      const box = document.createElement("div");
      box.classList.add("produto-box");
      box.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>R$ ${parseFloat(produto.preco).toFixed(2)}</p>
        <button class="btn-comprar" onclick="adicionarAoCarrinho(${produto.id})">Comprar</button>
      `;
      container.appendChild(box);
    });
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(id) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

window.onload = carregarProdutos;