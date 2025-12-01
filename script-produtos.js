fetch('https://fullfire-backend.onrender.com/produtos')
  .then(res => res.json())
  .then(produtos => {
    const container = document.getElementById('lista-produtos');
    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = 'produto';

      card.innerHTML = `
        <img src="${produto.imagem || 'sem-imagem.jpg'}" alt="${produto.nome}" style="width:150px">
        <h3>${produto.nome}</h3>
        <p>R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
        <p>${produto.descricao}</p>
        <a href="detalhes.html?id=${produto.id}" class="botao">Ver Detalhes</a>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar produtos:', error);
  });