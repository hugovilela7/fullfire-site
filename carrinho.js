let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function atualizarCarrinho() {
  const tabela = document.querySelector("#tabelaCarrinho tbody");
  tabela.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    tabela.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td><img src="${item.imagem}"></td>
        <td>R$ ${item.preco.toFixed(2).replace(".", ",")}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${subtotal.toFixed(2).replace(".", ",")}</td>
        <td><button onclick="remover(${index})">X</button></td>
      </tr>
    `;
  });

  document.getElementById("totalCarrinho").innerText =
    "Total: R$ " + total.toFixed(2).replace(".", ",");
}

function remover(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio!");
    return;
  }

  window.location.href = "pagamento.html";
}

atualizarCarrinho();