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
    else return (allMatch = true);
  }
}

btnVerificar.addEventListener("click", async () => {
   if (!inputLetras.value || inputLetras.value.length <= 2) {
    alert("Digite uma palavra")
    return
  } 
  const limpo = inputLetras.value.trim().toLowerCase();
  const palavraExistente = await chamarApiDicionario(limpo);
  console.log(palavraExistente)
  if (!palavraExistente) return;

  if (isPalindrome(limpo)) btnVerificar.textContent = "✔"
  else btnVerificar.textContent = "❌"
})