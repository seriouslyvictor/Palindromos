let angulo = 0;
let animationFrameId;
const btnVerificar = document.getElementById("verificar")
const inputLetras = document.querySelector("#palavra")
const palindromos = []
const palavrasAnteriores = []
let dadosApi;

function animarGradiente(speed = 3) {
  angulo += speed;
  document.documentElement.style.setProperty("--angulo", `${angulo}deg`);
  animationFrameId = requestAnimationFrame(() => animarGradiente(speed));
}
function startAnimation(speed) {
  stopAnimation();
  animarGradiente(speed);
}

function stopAnimation() {
  animationFrameId
    ? cancelAnimationFrame(animationFrameId)
    : (animationFrameId = null);
}

// startAnimation(5);

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
}

const verificarPalavraAnterior = function (palavra) {
  if (palavrasAnteriores.includes(palavra)) {
    return true
  } else {
    palavrasAnteriores.push(palavra)
  }
}


const chamarApiDicionario = async function (url) {
  const requisição = `https://api.dicionario-aberto.net/word/${url}`;

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
  }
}


function isPalindrome(word) {
  const reverse = word.split("").reverse().join("");
  let allMatch = false;
  const letras = word.split("");

  for (const [idx, letra] of letras.entries()) {
    if (letra !== reverse[idx]) return allMatch;
    else {
      adicionarPalavra(word)
      return allMatch = true
    };
  }
}

btnVerificar.addEventListener("click", async () => {
  if (!inputLetras.value || inputLetras.value.length <= 2) {
    alert("Digite uma palavra")
    return
  }
  const limpo = inputLetras.value.trim().toLowerCase();
  if (verificarPalavraAnterior(limpo)) {
    alert("Você já tentou essa palavra 👀")
    return
  }
  const palavraExistente = await chamarApiDicionario(limpo);
  console.log(palavraExistente)
  if (!palavraExistente) return;

  if (isPalindrome(limpo)) {
    btnVerificar.textContent = "✔"
    atualizarPainel()
  }
  else btnVerificar.textContent = "❌"
})