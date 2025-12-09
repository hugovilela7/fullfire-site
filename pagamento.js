// ==============================
// CONFIGURAÇÕES INICIAIS
// ==============================
const API_URL = "https://fullfire-backend.onrender.com";

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
function formatReal(n) {
  return n.toFixed(2).replace(".", ",");
}

// ==============================
// CÁLCULO DO TOTAL DOS PRODUTOS
// ==============================
let totalProdutos = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
let valorFrete = 0;
let totalFinal = totalProdutos;

// Exibe total inicial
document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);

// ==============================
// AUTO-PREENCHIMENTO DO CEP + FRETE
// ==============================
document.getElementById("cep").addEventListener("blur", async () => {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    const data = await res.json();

    if (!data.erro) {
      document.getElementById("endereco").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("estado").value = data.uf || "";

      if (data.uf !== "SP") {
        document.getElementById("freteInfo").innerHTML =
          <span style="color:#f66;">Entrega indisponível para este CEP fora de SP.</span>;

        valorFrete = 0;
        totalFinal = totalProdutos;

        document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);
        return;
      }

      // Frete SP
      valorFrete = 9.90;
      totalFinal = totalProdutos + valorFrete;

      document.getElementById("freteInfo").innerHTML =
        `Frete (SP): R$ ${formatReal(valorFrete)}`;

      document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);
    }

  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
  }
});

// ==============================
// CAMPOS EXTRAS DO PAGAMENTO
// ==============================
document.getElementById("forma").addEventListener("change", (e) => {
  const div = document.getElementById("camposAdicionais");
  const value = e.target.value;

  if (value === "pix") {
    div.innerHTML = `
      <p><strong>Chave PIX:</strong> 11999999999 (exemplo)</p>
    `;
  } 
  
  else if (value === "qrcode") {
    div.innerHTML = `
      <div class="qr">QR CODE</div>
    `;
  } 
  
  else if (value === "cartao") {
    div.innerHTML = `
      <label>Número do cartão</label>
      <input id="numCartao">

      <label>Validade</label>
      <input id="val">

      <label>CVV</label>
      <input id="cvv">
    `;
  } 
  
  else {
    div.innerHTML = "";
  }
});

// ==============================
// FINALIZAR PEDIDO
// ==============================
document.getElementById("btnConfirm").addEventListener("click", async () => {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const celular = document.getElementById("celular").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();
  const formaPagamento = document.getElementById("forma").value;

  if (!nome || !email || !celular || !endereco || !numero || !bairro || !cidade || !estado || !formaPagamento) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (estado !== "SP") {
    alert("A Full Fire entrega apenas no Estado de São Paulo.");
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        celular,
        endereco,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        formaPagamento,
        frete: valorFrete,
        totalFinal,
        carrinho
      }),
    });

    const data = await resp.json();

    if (data && data.success) {
      localStorage.removeItem("carrinho");
      alert("Pedido realizado com sucesso!");
      window.location.href = "sucesso.html";
    } else {
      alert("Erro ao finalizar pedido. Tente novamente.");
    }

  } catch (err) {
    alert("Erro ao enviar pedido.");
    console.error(err);
  }
});