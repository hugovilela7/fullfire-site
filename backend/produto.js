const mongoose = require('mongoose');

// Define o schema do produto
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  imagem: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  }
});

// Cria o modelo Produto baseado no schema
const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;