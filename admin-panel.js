const API_URL = "https://fullfire-backend.onrender.com";

let produtos = [];
let produtoEditandoId = null;

// Carrega produtos ao iniciar
async function carregarProdutos() {
  try {
    const res = await fetch(`${API_URL}/produtos`);
    produtos = await res.json();
    renderizarTabela();
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

function renderizarTabela() {
  const corpoTabela = document.querySelector("#tabelaProdutos tbody");
  corpoTabela.innerHTML = "";

  produtos.forEach(produto => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
      <td>${produto.descricao}</td>
      <td><img src="${produto.imagem}" width="50" /></td>
      <td>
        <button onclick="editarProduto(${produto.id})">Editar</button>
        <button style="background-color:red;color:white;" onclick="excluirProduto(${produto.id})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function editarProduto(id) {
  produtoEditandoId = id;
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  document.getElementById("editar-nome").value = produto.nome;
  document.getElementById("editar-preco").value = produto.preco;
  document.getElementById("editar-descricao").value = produto.descricao;
  document.getElementById("editar-imagem").value = produto.imagem;

  document.getElementById("modal-editar").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-editar").style.display = "none";
}

async function salvarEdicao() {
  const nome = document.getElementById("editar-nome").value.trim();
  const preco = parseFloat(document.getElementById("editar-preco").value);
  const descricao = document.getElementById("editar-descricao").value.trim();
  const imagem = document.getElementById("editar-imagem").value.trim();

  if (!nome || isNaN(preco) || !descricao || !imagem) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/produtos/${produtoEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco, descricao, imagem })
    });
    const atualizado = await res.json();
    const index = produtos.findIndex(p => p.id === produtoEditandoId);
    produtos[index] = atualizado;
    fecharModal();
    renderizarTabela();
  } catch (erro) {
    console.error("Erro ao salvar edição:", erro);
    alert("Erro ao editar produto.");
  }
}

async function excluirProduto(id) {
  if (!confirm("Deseja realmente excluir este produto?")) return;

  try {
    await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
    produtos = produtos.filter(p => p.id !== id);
    renderizarTabela();
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);
  }
}

// Adicionar produto
document.getElementById("formAdicionar").addEventListener("submit", async e => {
  e.preventDefault();

  const nome = document.getElementById("nomeProduto").value.trim();
  const preco = parseFloat(document.getElementById("precoProduto").value);
  const descricao = document.getElementById("descricaoProduto").value.trim();
  const imagem = document.getElementById("imagemProduto").value.trim();

  if (!nome || isNaN(preco) || !descricao || !imagem) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco, descricao, imagem })
    });
    const novoProduto = await res.json();
    produtos.push(novoProduto);
    renderizarTabela();
    e.target.reset();
  } catch (erro) {
    console.error("Erro ao adicionar produto:", erro);
  }
});

window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;

carregarProdutos();