function comprarZap(nomeProduto, precoUnitario, idInputQuantidade) {
    // 1. Pega a quantidade que o usuário digitou
    const inputQtd = document.getElementById(idInputQuantidade);
    let quantidade = parseInt(inputQtd.value);

    // Validação simples: se for menor que 1, assume 1
    if (quantidade < 1 || isNaN(quantidade)) {
        quantidade = 1;
    }

    // 2. Calcula o total estimado
    const total = (quantidade * precoUnitario).toFixed(2).replace('.', ',');

    // 3. Monta a mensagem para o WhatsApp
    // O comando \n serve para pular linha
    const mensagem = `Olá, Full Fire! 🔥\n\n` +
        `Gostaria de fazer um pedido:\n` +
        `ITEM: *${nomeProduto}*\n` +
        `QUANTIDADE: *${quantidade}*\n` +
        `------------------------------\n` +
        `Valor Total Estimado: R$ ${total}\n\n` +
        `Como faço para finalizar o pagamento?`;

    // 4. Configura o número e abre o link
    const numeroLoja = "5511977135785";
    const textoCodificado = encodeURIComponent(mensagem);
    const linkWhatsapp = `https://wa.me/${numeroLoja}?text=${textoCodificado}`;

    // Abre em nova aba
    window.open(linkWhatsapp, '_blank');
}

// FUNÇÃO PARA O BOTÃO FLUTUANTE DO WHATSAPP
function openWhatsappDirect(event) {
    // Impede o comportamento padrão do link (#)
    event.preventDefault(); 
    
    const numeroLoja = "5511977135785";
    
    // Mensagem de contato geral para quem clica no botão flutuante
    const mensagem = "Olá, Full Fire! 🔥 Gostaria de mais informações ou tirar dúvidas sobre os produtos de carvão.";
    
    const textoCodificado = encodeURIComponent(mensagem);
    const linkWhatsapp = `https://wa.me/${numeroLoja}?text=${textoCodificado}`;

    // Abre em nova aba
    window.open(linkWhatsapp, '_blank');
}