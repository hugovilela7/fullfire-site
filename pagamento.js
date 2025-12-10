// ==============================
// 1. CHAVE PIX ESTÁTICA (REMOVIDA/NÃO MAIS USADA)
// ==============================
// const CHAVE_PIX_DA_LOJA = "seu-email@dominio.com.br"; // Não precisamos mais desta chave estática!

// ==============================
// CONFIGURAÇÕES INICIAIS
// ==============================
const API_URL = "https://fullfire-backend.onrender.com"; // Mantido
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Variáveis para guardar os dados de frete e total, usados no envio
let valorFrete = 0; 
let totalProdutos = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
let totalFinal = totalProdutos; 
let txidPedido = null; // Guardará o ID do pedido retornado pelo backend

function formatReal(n) {
    const num = parseFloat(n) || 0;
    return num.toFixed(2).replace(".", ",");
}

// Exibe total inicial
document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);


// ==============================
// AUTO-PREENCHIMENTO DO CEP + FRETE
// (Lógica mantida para cálculo de frete e totalFinal)
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
                alert("Desculpe, a Full Fire entrega apenas no Estado de São Paulo.");
                document.getElementById("total").innerText = "R$ " + formatReal(totalFinal);
                return;
            }

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
// FUNÇÃO PARA COPIAR O PAYLOAD PIX
// ==============================
function copiarPix() {
    const pixKey = document.getElementById('pixPayload');
    pixKey.select();
    pixKey.setSelectionRange(0, 99999); 
    document.execCommand("copy");
    alert("Código PIX Copia e Cola copiado!");
}

// ==============================
// LÓGICA DE EXIBIÇÃO DE PAGAMENTO DINÂMICO
// (Substitui a lógica de chave fixa)
// ==============================
document.getElementById("forma").addEventListener("change", (e) => {
    const div = document.getElementById("camposAdicionais");
    const value = e.target.value;

    if (value === "pix" || value === "qrcode") {
        // Mostra uma mensagem informativa e pede para o usuário clicar em Confirmar
        div.innerHTML = `
            <div style="padding: 15px; border: 1px dashed gold; border-radius: 8px; background: #222;">
                <h4>PIX Dinâmico</h4>
                <p>Ao *Confirmar Pedido*, o código PIX e QR Code serão gerados.</p>
                <p style="color:#aaa; font-size: 0.9em; margin-top: 10px;">
                    O pagamento será único para este pedido e expira em 30 minutos.
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
// FINALIZAR PEDIDO (Correção de variável)
// ==============================
document.getElementById("btnConfirm").addEventListener("click", async () => {
    
    // FORÇAR RECALCULO E GARANTIR VALORES NUMÉRICOS ANTES DO ENVIO
    totalProdutos = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
    valorFrete = valorFrete || 0; // Garante que Frete é 0 se não foi calculado
    totalFinal = totalProdutos + valorFrete; // Recalcula o total final
    // FIM DA CORREÇÃO

    // 1. COLETAR E VALIDAR DADOS
// ... (restante do código)
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
    
    // Se o pedido já foi confirmado e o PIX foi gerado, não envia novamente.
    if (txidPedido) {
        alert("O código PIX já foi gerado. Por favor, faça o pagamento ou recarregue a página.");
        return;
    }

    // 2. ENVIAR PARA O NOVO ENDPOINT DE PIX
    try {
        // ATUALIZAÇÃO CRÍTICA: Rota mudada de /pedidos para /gerar-pix
        const resp = await fetch(`${API_URL}/gerar-pix`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome, email, celular, cep, endereco, numero, bairro, cidade, estado, 
                formaPagamento, valorFrete, totalFinal, carrinho
            }),
        });

        const data = await resp.json();

        if (data && data.success) {
            // Guarda o ID do pedido para evitar reenvio
            txidPedido = data.pedidoId; 

            // 3. EXIBIR O PIX DINÂMICO
            const pixData = data.pixData;
            
            // Renderiza a nova área de PIX
            document.getElementById("camposAdicionais").innerHTML = `
                <div style="text-align:center; padding: 15px; border: 1px solid gold; border-radius: 8px; background: #222;">
                    <h4>PIX Gerado com Sucesso!</h4>
                    <p>Valor Total: <strong>R$ ${formatReal(totalFinal)}</strong></p>
                    <hr style="border-color: #444; margin: 15px 0;">

                    <p>Leia o QR Code abaixo:</p>
                    <img src="data:image/png;base64,${pixData.qrCode}" alt="QR Code PIX" style="width: 200px; height: 200px; margin: 10px auto; border: 1px solid #444;">

                    <label style="margin-top: 15px; display: block;">Código PIX (Copia e Cola):</label>
                    <textarea id="pixPayload" rows="3" readonly style="width:100%; resize:none; font-size:14px; padding:8px; text-align:center; color: black; font-weight: bold; cursor: text;">${pixData.payload}</textarea>
                    
                    <button onclick="copiarPix()" style="padding: 10px; background: gold; color: black; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        Copiar Código
                    </button>
                    
                    <p style="margin-top: 20px; color:lightgreen; font-weight: bold;">
                        Aguardando confirmação do pagamento...
                    </p>
                </div>
            `;
            
            // Opcional: Desabilitar o botão de confirmar para evitar reenvios
            document.getElementById("btnConfirm").innerText = "Aguardando Pagamento";
            document.getElementById("btnConfirm").disabled = true;

            // OBS: O redirecionamento para sucesso.html deve acontecer
            // AGORA VIA WEBHOOK (servidor), e não mais no frontend!

        } else {
            alert("Erro ao gerar PIX. Tente novamente ou escolha outra forma de pagamento.");
        }

    } catch (err) {
        alert("Erro ao comunicar com o servidor. Verifique a API_URL.");
        console.error(err);
    }
});