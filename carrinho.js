const API_URL = "https://fullfire-backend.onrender.com";
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function renderizarCarrinho() {
  const tabela = document.querySelector("#tabelaCarrinho tbody");
  tabela.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.nome}</td>
      <td><img src="${item.imagem || ''}" alt="${item.nome}"></td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.quantidade}" onchange="atualizarQuantidade(${index}, this.value)">
      </td>
      <td>R$ ${subtotal.toFixed(2)}</td>
      <td><button class="btn" onclick="removerProduto(${index})">X</button></td>
    `;
    tabela.appendChild(linha);
  });

  document.getElementById("totalCarrinho").innerText = `Total: R$ ${total.toFixed(2)}`;
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarQuantidade(index, quantidade) {
  carrinho[index].quantidade = parseInt(quantidade);
  renderizarCarrinho();
}

function removerProduto(index) {
  carrinho.splice(index, 1);
  renderizarCarrinho();
}

function finalizarCompra() {
  if(carrinho.length === 0){
    alert("O carrinho está vazio!");
    return;
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.href = "pagamento.html";
}

// Inicializa
renderizarCarrinho();