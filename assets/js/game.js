const player = document.getElementById("player");
const doors = document.querySelectorAll(".door");
const controlsHint = document.getElementById("controls-hint");

let x = 100;
let y = window.innerHeight * 0.6;

let vx = 0;
let vy = 0;

const speed = 0.6;
const maxSpeed = 5;
const gravity = 0.5;
const jumpPower = 12;
let onGround = false;

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function update() {

  /* Déplacements horizontaux */
  if (keys["q"]) vx -= speed;
  if (keys["d"]) vx += speed;

  /* Limite de vitesse */
  vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));

  /* Friction */
  vx *= 0.85;

  /* Saut */
  if (keys["z"] && onGround) {
    vy = -jumpPower;
    onGround = false;
  }

  /* Gravité */
  vy += gravity;

  /* Position */
  x += vx;
  y += vy;

  /* Sol */
  const ground = window.innerHeight * 0.7;
  if (y >= ground) {
    y = ground;
    vy = 0;
    onGround = true;
  }

  /* Application */
  player.style.left = x + "px";
  player.style.top = y + "px";

  requestAnimationFrame(update);
}

update();

function isColliding(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.top > r2.bottom ||
    r1.bottom < r2.top ||
    r1.left > r2.right ||
    r1.right < r2.left
  );
}

setInterval(() => {
  doors.forEach(door => {
    if (isColliding(player, door)) {
      alert("Ouverture : " + door.dataset.section);
    }
  });
}, 100);

document.addEventListener("keydown", () => {
  controlsHint.style.opacity = "0";
  controlsHint.style.transition = "opacity 0.5s";
});
