// Produtos FIXOS
const produtos = [
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

// Renderização dos produtos fixos
const container = document.getElementById("produtos-container");

produtos.forEach(prod => {
  const card = document.createElement("div");
  card.classList.add("produto-card");

  card.innerHTML = `
    <img src="${prod.imagem}" alt="${prod.nome}">
    <h3>${prod.nome}</h3>
    <p class="preco">R$ ${prod.preco.toFixed(2).replace(".", ",")}</p>
    <button onclick="verDetalhes(${prod.id})">Ver Detalhes</button>
  `;

  container.appendChild(card);
});

function verDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}