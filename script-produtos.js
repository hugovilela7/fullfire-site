// Produtos fixos (sem banco)
const produtosFixos = [
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

// Carrega produtos fixos na página
function carregarProdutos() {
  const container = document.getElementById("produtosContainer");
  container.innerHTML = "";

  produtosFixos.forEach(produto => {
    const box = document.createElement("div");
    box.classList.add("produto-box");
    box.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>

      <!-- NOVO: Botão leva para página de detalhes -->
      <button class="btn-comprar" onclick="irParaDetalhes(${produto.id})">
        Comprar
      </button>
    `;
    container.appendChild(box);
  });
}

// NOVA FUNÇÃO: enviar para tela de detalhes com o ID
function irParaDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

window.onload = carregarProdutos;