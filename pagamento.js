// ==============================
// 1. CHAVE PIX ESTÁTICA (Você deve atualizar esta linha com a chave REAL)
// ==============================
const CHAVE_PIX_DA_LOJA = "seu-email@dominio.com.br"; // <-- COLOQUE A CHAVE PIX REAL AQUI!

// ==============================
// CONFIGURAÇÕES INICIAIS
// ==============================
const API_URL = "https://fullfire-backend.onrender.com"; // Mantido para o envio final do pedido
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function formatReal(n) {
    // Garante que o n seja um número para toFixed funcionar
    const num = parseFloat(n) || 0;
    return num.toFixed(2).replace(".", ",");
}

// ==============================
// CÁLCULO E EXIBIÇÃO DO TOTAL INICIAL (Executado ao carregar a página)
// ==============================
let totalProdutos = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
let valorFrete = 0; // Começa em zero
let totalFinal = totalProdutos; // O total inicial é apenas o dos produtos

// Exibe total inicial
document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);

// ==============================
// AUTO-PREENCHIMENTO DO CEP + FRETE (Com correção da sintaxe de crase)
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
                // CORREÇÃO: Usando crases ( ` ) para evitar Uncaught SyntaxError
                document.getElementById("freteInfo").innerHTML =
                    `<span style="color:#f66;">Entrega indisponível para este CEP fora de SP.</span>`; 

                valorFrete = 0;
                totalFinal = totalProdutos;
                alert("Desculpe, a Full Fire entrega apenas no Estado de São Paulo."); 

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
// FUNÇÃO PARA COPIAR A CHAVE PIX
// ==============================
function copiarPix() {
    const pixKey = document.getElementById('pixKey');
    pixKey.select();
    pixKey.setSelectionRange(0, 99999); 
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

// ==============================
// CAMPOS EXTRAS DO PAGAMENTO (Lógica Simplificada com chave fixa)
// ==============================
document.getElementById("forma").addEventListener("change", (e) => {
    const div = document.getElementById("camposAdicionais");
    const value = e.target.value;

    if (value === "pix" || value === "qrcode") { // Ambos usam a chave fixa
        
        div.innerHTML = `
            <div style="text-align:center; padding: 15px; border: 1px dashed gold; border-radius: 8px; background: #222;">
                <h4>PIX - Pagamento Manual</h4>
                <p><strong>Valor Total a Pagar: R$ ${formatReal(totalFinal)}</strong></p>
                <hr style="border-color: #444; margin: 15px 0;">
                
                <label style="margin-top: 10px; display: block;">Chave PIX do Recebedor:</label>
                <textarea id="pixKey" rows="1" readonly style="width:100%; resize:none; font-size:16px; padding:8px; text-align:center; color: black; font-weight: bold;">${CHAVE_PIX_DA_LOJA}</textarea>
                
                <button onclick="copiarPix()" style="padding: 10px; background: gold; color: black; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Copiar Chave
                </button>
                
                <p style="margin-top: 15px; color:#aaa; font-size: 0.9em;">
                    *Importante:* Copie a chave, vá ao seu banco e faça um PIX neste valor. Seu pedido será processado após a confirmação.
                </p>
            </div>
        `;
    }

    else if (value === "cartao") {
        // Campos Simples de Cartão (Simulação)
        div.innerHTML = `
            <label>Número do cartão</label><input id="numCartao">
            <label>Validade</label><input id="val">
            <label>CVV</label><input id="cvv">
        `;
    }

    else {
        div.innerHTML = "";
    }
});

// ==============================
// FINALIZAR PEDIDO (Mantido)
// ==============================
document.getElementById("btnConfirm").addEventListener("click", async () => {
    // ... (restante do código de validação e envio para o backend - MANTIDO)
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