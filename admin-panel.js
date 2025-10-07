let produtos = [];
let produtoEditandoId = null;

// Carrega os produtos ao iniciar
fetch("http://localhost:3000/produtos")
  .then(res => res.json())
  .then(data => {
    produtos = Array.isArray(data) ? data : [];
    renderizarTabela();
  })
  .catch(error => console.error("Erro ao carregar produtos:", error));

// Renderiza a tabela de produtos
function renderizarTabela() {
  const corpoTabela = document.querySelector("#tabelaProdutos tbody");
  corpoTabela.innerHTML = "";

  produtos.forEach((produto, index) => {
    const linha = document.createElement("tr");
   linha.innerHTML = `
      <td style="text-align: center;">${produto.nome}</td>
      <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
      <td style="text-align: center;">${produto.descricao}</td>
      <td><img src="${produto.imagem}" width="50" /></td>
      <td>
        <button style="margin-right: 6px;" onclick="editarProduto(${index})">Editar</button>
        <button style="background-color: red; color: white;" onclick="excluirProduto(${index})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

// Editar produto
function editarProduto(index) {
  const produto = produtos[index];
  produtoEditandoId = produto.id;

  document.getElementById('editar-nome').value = produto.nome;
  document.getElementById('editar-preco').value = produto.preco;
  document.getElementById('editar-descricao').value = produto.descricao;
  document.getElementById('editar-imagem').value = produto.imagem;

  document.getElementById('modal-editar').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-editar').style.display = 'none';
}

function salvarEdicao() {
  const nome = document.getElementById('editar-nome').value.trim();
  const preco = parseFloat(document.getElementById('editar-preco').value);
  const descricao = document.getElementById('editar-descricao').value.trim();
  const imagem = document.getElementById('editar-imagem').value.trim();

  if (!nome || isNaN(preco) || !descricao || !imagem) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  fetch(`http://localhost:3000/produtos/${produtoEditandoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco, descricao, imagem })
  })
    .then(res => res.json())
    .then(produtoAtualizado => {
      const index = produtos.findIndex(p => p.id === produtoEditandoId);
      produtos[index] = produtoAtualizado;
      fecharModal();
      renderizarTabela();
    })
    .catch(error => {
      alert('Erro ao editar produto.');
      console.error(error);
    });
}

// Excluir produto
function excluirProduto(index) {
  const produto = produtos[index];
  const id = produto.id;

  if (confirm("Tem certeza que deseja excluir este produto?")) {
    fetch(`http://localhost:3000/produtos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        produtos.splice(index, 1);
        renderizarTabela();
      })
      .catch(error => console.error("Erro ao excluir produto:", error));
  }
}

// Pedidos
function carregarPedidos() {
  fetch("http://localhost:3000/pedidos")
    .then(res => res.json())
    .then(dados => renderizarPedidos(dados))
    .catch(err => console.error("Erro ao carregar pedidos:", err));
}

function renderizarPedidos(pedidos) {
  const corpo = document.querySelector("#tabelaPedidos tbody");
  corpo.innerHTML = "";

  pedidos.forEach((pedido) => {
    let produtosTexto = "Nenhum produto";
    if (Array.isArray(pedido.produtos) && pedido.produtos.length > 0) {
      const produtosFormatados = pedido.produtos.map(p => `
        <div>${p.quantidade}x ${p.nome} – R$ ${parseFloat(p.preco).toFixed(2)}</div>
      `).join("");

      const total = pedido.produtos.reduce((soma, p) => soma + parseFloat(p.preco) * p.quantidade, 0).toFixed(2);

      produtosTexto = `
        <div style="max-width: 200px; word-wrap: break-word;">
          ${produtosFormatados}
          <div style="margin-top: 5px; font-weight: bold">Total: R$ ${total}</div>
        </div>
      `;
    }

    const linha = document.createElement("tr");
    linha.innerHTML = `
  <td style="text-align: center;">${new Date(pedido.data).toLocaleString()}</td>
  <td style="text-align: center;">${pedido.nome}</td>
  <td style="text-align: center;">${pedido.celular}</td>
  <td style="text-align: center;">${pedido.email}</td>
  <td style="text-align: center;">${pedido.endereco}</td>
  <td style="text-align: center;">${pedido.bairro}</td>
  <td style="text-align: center;">${pedido.cidade}</td>
  <td style="text-align: center;">${pedido.estado}</td>
  <td style="text-align: center;">${pedido.forma_pagamento}</td>
  <td class="produtos-coluna" style="text-align: center;">${produtosTexto}</td>
`;
    corpo.appendChild(linha);
  });
}

carregarPedidos();

// Adicionar novo produto
document.getElementById("formAdicionar").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nomeProduto").value.trim();
  const precoInput = document.getElementById("precoProduto").value;
  const preco = parseFloat(precoInput);
  const descricao = document.getElementById("descricaoProduto").value.trim();
  const imagem = document.getElementById("imagemProduto").value.trim();

  if (!nome || isNaN(preco) || preco <= 0 || !descricao || !imagem) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  fetch("http://localhost:3000/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco, descricao, imagem }),
  })
    .then(res => res.json())
    .then(produtoSalvo => {
      produtos.push(produtoSalvo);
      renderizarTabela();
      e.target.reset();
    })
    .catch(error => console.error("Erro ao adicionar produto:", error));
});

// Torna as funções visíveis no HTML
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;