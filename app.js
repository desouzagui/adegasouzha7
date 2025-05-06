let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [{usuario: "admin", senha: "1234"}];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function salvarProdutos() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function salvarVendas() {
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function salvarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function login() {
  const u = document.getElementById("loginUsuario").value;
  const s = document.getElementById("loginSenha").value;
  const user = usuarios.find(x => x.usuario === u && x.senha === s);
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
    renderizarProdutos();
    renderizarRelatorio();
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

function renderizarProdutos() {
  const lista = document.getElementById("produtos");
  lista.innerHTML = "";
  produtos.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} - R$${p.preco.toFixed(2)} (Estoque: ${p.estoque})`;
    li.onclick = () => adicionarAoCarrinho(i);
    lista.appendChild(li);
  });
}

function renderizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  lista.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;
    lista.appendChild(li);
    total += item.preco;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

function renderizarRelatorio() {
  const lista = document.getElementById("relatorio-vendas");
  lista.innerHTML = "";
  vendas.forEach((venda, i) => {
    const li = document.createElement("li");
    li.textContent = `Venda ${i+1} - R$${venda.total.toFixed(2)}`;
    lista.appendChild(li);
  });
}

function adicionarProduto() {
  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);
  const estoque = parseInt(document.getElementById("estoqueProduto").value);
  if (nome && preco && estoque >= 0) {
    produtos.push({ nome, preco, estoque });
    salvarProdutos();
    renderizarProdutos();
    document.getElementById("nomeProduto").value = "";
    document.getElementById("precoProduto").value = "";
    document.getElementById("estoqueProduto").value = "";
  }
}

function adicionarAoCarrinho(index) {
  if (produtos[index].estoque > 0) {
    carrinho.push({ nome: produtos[index].nome, preco: produtos[index].preco });
    produtos[index].estoque -= 1;
    salvarProdutos();
    renderizarProdutos();
    renderizarCarrinho();
  } else {
    alert("Estoque esgotado!");
  }
}

function finalizarVenda() {
  const total = carrinho.reduce((acc, p) => acc + p.preco, 0);
  if (total > 0) {
    vendas.push({ itens: [...carrinho], total });
    salvarVendas();
    imprimirRecibo(carrinho, total);
    carrinho = [];
    renderizarCarrinho();
    renderizarRelatorio();
    alert("Venda finalizada!");
  }
}

function imprimirRecibo(itens, total) {
  let recibo = "Recibo - Adega Souza\n\n";
  itens.forEach(p => recibo += `${p.nome} - R$${p.preco.toFixed(2)}\n`);
  recibo += `\nTotal: R$${total.toFixed(2)}`;
  const win = window.open("", "", "width=300,height=400");
  win.document.write(`<pre>${recibo}</pre>`);
  win.print();
  win.close();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBox").style.display = "block";
});