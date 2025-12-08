const API_URL = "https://fullfire-backend.onrender.com";

async function carregarPedidos() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    const pedidos = await res.json();

    const tabela = document.querySelector("#tabelaPedidos tbody");
    tabela.innerHTML = "";

    pedidos.forEach(p => {
      const listaProdutos = p.carrinho
        .map(item => `${item.nome} (x${item.quantidade})`)
        .join("<br>");

      const data = new Date(p.createdAt).toLocaleString("pt-BR");

      tabela.innerHTML += `
        <tr>
          <td>${data}</td>
          <td>${p.nome}</td>
          <td>${p.celular}</td>
          <td>${p.email}</td>
          <td>${p.endereco}</td>
          <td>${p.bairro}</td>
          <td>${p.cidade}</td>
          <td>${p.estado}</td>
          <td>${p.formaPagamento}</td>
          <td>${listaProdutos}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
  }
}

carregarPedidos();