// Recupera produtos e carrinho
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

async function atualizarCarrinho() {
  const container = document.getElementById("carrinhoContainer");
  if (!container) return;

  container.innerHTML = "";
  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  try {
    const res = await fetch("https://fullfire-backend.onrender.com/produtos");
    const produtos = await res.json();

    let total = 0;

    carrinho.forEach(item => {
      const produto = produtos.find(p => p.id === item.id);
      if (!produto) return;

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      const linha = document.createElement("div");
      linha.classList.add("item-carrinho");
      linha.innerHTML = `
        <span>${produto.nome}</span>
        <span>R$ ${produto.preco.toFixed(2)} x ${item.quantidade}</span>
        <button onclick="removerDoCarrinho(${produto.id})">❌</button>
      `;
      container.appendChild(linha);
    });

    const totalLinha = document.createElement("div");
    totalLinha.innerHTML = <strong>Total: R$ ${total.toFixed(2)}</strong>;
    container.appendChild(totalLinha);

  } catch (erro) {
    console.error("Erro ao atualizar carrinho:", erro);
  }
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

window.onload = atualizarCarrinho;