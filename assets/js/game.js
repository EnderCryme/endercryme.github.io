const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameWorld = document.getElementById("game-world");

startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameWorld.classList.add("active");
});
