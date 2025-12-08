// carrinho.js - caso use arquivo externo
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function formatReal(n){ return n.toFixed(2).replace('.', ','); }

function atualizarCarrinhoDOM() {
  const tabela = document.querySelector('#tabelaCarrinho tbody');
  if(!tabela) return;
  tabela.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, idx) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td><img src="${item.imagem}" alt="${item.nome}" style="width:60px;border-radius:6px;"></td>
      <td>R$ ${formatReal(item.preco)}</td>
      <td><input type="number" min="1" value="${item.quantidade}" data-idx="${idx}" class="qtd-input" style="width:70px"></td>
      <td>R$ ${formatReal(subtotal)}</td>
      <td><button data-remove="${idx}" class="btn btn-danger">X</button></td>
    `;
    tabela.appendChild(tr);
  });

  const totalEl = document.getElementById('totalCarrinho');
  if(totalEl) totalEl.innerText = 'Total: R$ ' + formatReal(total);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  // Atualiza badge global se existir
  const cartCount = document.getElementById('cartCount');
  if(cartCount) cartCount.innerText = carrinho.reduce((s,i)=>s+(i.quantidade||0),0);
}

document.addEventListener('input', (e) => {
  if(e.target && e.target.classList.contains('qtd-input')){
    const idx = Number(e.target.dataset.idx);
    let q = parseInt(e.target.value) || 1;
    if(q < 1) q = 1;
    carrinho[idx].quantidade = q;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoDOM();
  }
});

document.addEventListener('click', (e) => {
  if(e.target && e.target.dataset.remove !== undefined){
    const idx = Number(e.target.dataset.remove);
    carrinho.splice(idx,1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoDOM();
  }
});

function finalizarCompra(){
  if(carrinho.length === 0){
    alert('Carrinho vazio!');
    return;
  }
  window.location.href = 'pagamento.html';
}

// Inicializa se a página tiver tabela
if(document.querySelector('#tabelaCarrinho')){
  atualizarCarrinhoDOM();
  document.getElementById('btnFinalizar')?.addEventListener('click', finalizarCompra);
}