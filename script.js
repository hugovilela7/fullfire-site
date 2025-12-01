console.log("Site carregado com sucesso!");

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const index = carrinho.findIndex(item => item.id === produto.id);

  if (index > -1) {
    // Se já existir, aumenta a quantidade
    carrinho[index].quantidade += produto.quantidade;
  } else {
    // Senão, adiciona novo
    carrinho.push(produto);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

document.addEventListener("DOMContentLoaded", () => {
  
  // Seleção do método de pagamento
  const radios = document.querySelectorAll('input[name="pagamento"]');
  const metodoPix = document.getElementById("opcao-pix");
  const metodoBoleto = document.getElementById("opcao-boleto");
  const metodoCartao = document.getElementById("opcao-cartao");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      metodoPix.style.display = "none";
      metodoBoleto.style.display = "none";
      metodoCartao.style.display = "none";

      if (radio.value === "pix") metodoPix.style.display = "block";
      if (radio.value === "boleto") metodoBoleto.style.display = "block";
      if (radio.value === "cartao") metodoCartao.style.display = "block";
    });
  });

  // Formulário de pagamento
  const form = document.getElementById("form-pagamento");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "sucesso.html";
    });
  }

  // Exibição dos produtos (produtos.html)
  const container = document.getElementById("produtos");
  if (container) {
    fetch('https://fullfire-backend.onrender.com/produtos')
      .then(res => res.json())
      .then(produtos => {
        produtos.forEach(produto => {
          const card = document.createElement("div");
          card.className = "produto";

          card.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
          `;

          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
      });
  }
});