let angulo = 0;
let animationFrameId;
const btnVerificar = document.getElementById("verificar")
const inputLetras = document.querySelector("#palavra")
const palindromos = []
const palavrasAnteriores = []
let dadosApi;

const startSpinner = function (spinner) {
  spinner.style.borderColor = "transparent"
  spinner.style.animationPlayState = "running"
}

const stopSpinner = function (spinner) {
  spinner.style.borderColor = "white"
  spinner.style.animationPlayState = "paused"
}

const resgatarDados = function () {
  const storageArray = JSON.parse(localStorage.getItem('encontradas')) || []
  const anterioresArray = JSON.parse(localStorage.getItem("anteriores")) || []
  storageArray.map(item => palindromos.push(item))
  anterioresArray.map(item => palavrasAnteriores.push(item))
  palindromos ? atualizarPainel() : null
}

const formatarTempo = function (data) {
  data = new Date(data)
  const [dia, mes, ano] = [data.getDay(), data.getMonth(), data.getFullYear()]
  const diasPassados = Math.floor((new Date() - data) / (1000 * 60 * 60 * 24))
  switch (diasPassados) {
    case 0:
      return "Hoje"
    case 1:
      return "Ontem"
    case 2:
      return "2 Dias Atrás"
    case 3:
    case 4:
    case 5:
    case 6:
      return "Essa semana"
    default:
      return `${dia}/${mes}/${ano}`;
  }
}

const adicionarPalavra = function (palavra) {
  const palavraObj = {
    palindromo: palavra,
    numLetras: palavra.length,
    discovery: new Date(),
  }
  palindromos.push(palavraObj)
}

const atualizarPainel = function () {
  const scoreBoard = document.querySelector(".game--scoreboard")
  scoreBoard.innerHTML = ''
  palindromos.forEach(palin => {
    const novoPalindromo = document.createElement("div")
    novoPalindromo.classList.add("sb--item")
    novoPalindromo.innerHTML = `<span class="sb--palavra">${palin.palindromo.toUpperCase()}</span> <span class="sb--letras">${palin.numLetras}</span> <span class="sb--data">${formatarTempo(palin.discovery)}</span>`
    scoreBoard.append(novoPalindromo);
  })
  scoreBoard.classList.add("aberto")
  localStorage.setItem("encontradas", JSON.stringify(palindromos))
}

const verificarPalavraAnterior = function (palavra) {
  if (palavrasAnteriores.includes(palavra)) {
    return true
  } else {
    palavrasAnteriores.push(palavra)
    localStorage.setItem("anteriores", JSON.stringify(palavrasAnteriores));
  }
}


const chamarApiDicionario = async function (url) {
  const requisição = `https://api.dicionario-aberto.net/word/${url}`;
  startSpinner(btnVerificar)
  try {
    const resposta = await fetch(requisição);
    const dados = await resposta.json();

    if (!dados.length) {
      throw new Error("Essa palavra não existe...");
    }
    dadosApi = dados;
    return true; // Word exists
  } catch (erro) {
    alert(erro.message); // Show the error message to the user
    return false;
  } finally {
    console.log("requisição finalizada");
    setTimeout(() => { stopSpinner(btnVerificar) }, 600)
  }
}

const verificarAcerto = async () => {
  if (!inputLetras.value || inputLetras.value.length <= 2) {
    alert("Digite uma palavra")
    return
  }
  const limpo = inputLetras.value.trim().toLowerCase();
  if (verificarPalavraAnterior(limpo)) {
    alert("Você já tentou essa palavra 👀")
    inputLetras.focus()
    return
  }
  const palavraExistente = await chamarApiDicionario(limpo);
  if (!palavraExistente) return;

  if (isPalindrome(limpo)) {
    btnVerificar.textContent = "✔"
    setTimeout(() => { btnVerificar.textContent = "?" }, 1500)
    inputLetras.value = ""
    atualizarPainel()
  }
  else {
    btnVerificar.textContent = "❌"
    setTimeout(() => { btnVerificar.textContent = "?" }, 1500)
    inputLetras.focus()
  }

}

function isPalindrome(word) {
  const reverse = word.split("").reverse().join("");
  let allMatch = true;
  const letras = word.split("");

  for (const [idx, letra] of letras.entries()) {
    if (letra !== reverse[idx]) {
      allMatch = false;
      break
    }
  }
  allMatch ? adicionarPalavra(word) : null;
  return allMatch;
}

btnVerificar.addEventListener("click", verificarAcerto)
inputLetras.addEventListener("keypress", (e) => {
  console.log(e)
  e.key === "Enter" ? verificarAcerto() : null
})


document.addEventListener("DOMContentLoaded", resgatarDados)