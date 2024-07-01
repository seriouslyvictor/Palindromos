let angulo = 0;
let animationFrameId;

function animarGradiente(speed = 3) {
  angulo += speed;
  angulo >= 359 ? (angulo = 0) : null;
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

startAnimation(3);
