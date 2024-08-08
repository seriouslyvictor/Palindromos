let angulo = 0;
let animationFrameId;
const btnVerificar = document.getElementById("verificar")
const inputLetras = document.querySelector("#palavra")
const palindromos = []
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

startAnimation(5);

const adicionarPalavra = function (palavra) {
  const data = new Date();
  const dia = data.getDate();
  const mes = data.getMonth();
  const ano = data.getFullYear();
  const hora = data.getHours();
  const minutos = data.getMinutes();

  console.log(data)
  const palavraObj = {
    palindromo: palavra,
    numLetras: palavra.length,
    discovery: `${dia}/${mes}/${ano} - ${hora}:${minutos}`,
  }
  palindromos.push(palavraObj)
}

const atualizarPainel = function () {

}


const chamarApiDicionario = function (url) {
  const requisição = `https://api.dicionario-aberto.net/word/${url}`
  fetch(requisição)
    .then(resposta => resposta.json())
    .then(dados => {
      if (!dados.length) {
        throw new Error("Essa palavra não existe...")
      }
      dadosApi = dados
    })
    .catch(erro => alert(erro))
    .finally(console.log("requisição finalizada"))
}

function isPalindrome(word) {
  const reverse = word.split("").reverse().join("");
  let allMatch = false;
  const letras = word.split("");

  for (const [idx, letra] of letras.entries()) {
    if (letra !== reverse[idx]) return allMatch;
    else return (allMatch = true);
  }
}

btnVerificar.addEventListener("click", () => {
  if (isPalindrome(inputLetras.value)) btnVerificar.textContent = "✔"
  else btnVerificar.textContent = "❌"
})