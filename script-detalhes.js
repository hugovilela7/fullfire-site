const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

fetch(`http://localhost:3000/produtos/${id}`)
  .then(res => res.json())
  .then(produto => {
    if (produto) {
      document.getElementById("produto-container").innerHTML = `
  <h1>${produto.nome}</h1>
  <img src="${produto.imagem}" alt="${produto.nome}" style="max-width: 200px;">
  <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
  <p class="descricao">${produto.descricao}</p>

  <label for="quantidade">Quantidade:</label>
  <input type="number" id="quantidade" name="quantidade" value="1" min="1" style="width: 50px; margin: 0 10px;">
  <button id="adicionar-btn" class="botao">Adicionar ao Carrinho</button>
`;

document.getElementById("adicionar-btn").addEventListener("click", () => {
  const quantidade = parseInt(document.getElementById("quantidade").value) || 1;

  const item = {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    imagem: produto.imagem,
    quantidade: quantidade
  };

  adicionarAoCarrinho(item);
});

    } else {
      document.getElementById("produto-container").innerHTML = `<p>Produto não encontrado.</p>`;
    }
  })
  .catch(err => {
    console.error("Erro ao carregar produto:", err);
    document.getElementById("produto-container").innerHTML = `<p>Erro ao carregar produto.</p>`;
  });

function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const index = carrinho.findIndex(item => item.id === produto.id);

  if (index !== -1) {
    carrinho[index].quantidade += produto.quantidade;
  } else {
    carrinho.push(produto);
  }

  function mostrarAlertaPersonalizado(mensagem) {
  const div = document.getElementById('mensagem-alerta');
  div.innerText = mensagem;
  div.style.display = 'block';

  // Reinicia a animação
  div.style.animation = 'none';
  void div.offsetWidth; // força reinício
  div.style.animation = 'fadeOut 3s forwards';
}

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
mostrarAlertaPersonalizado("Produto adicionado ao carrinho!");
}