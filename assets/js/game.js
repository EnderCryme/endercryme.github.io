/* =========================
   RÉFÉRENCES DOM
========================= */
const game = document.getElementById("game");
const player = document.getElementById("player");
const controlsHint = document.getElementById("controls-hint");
const interactHint = document.getElementById("interact-hint");
const doors = document.querySelectorAll(".door");

/* =========================
   POSITION & PHYSIQUE
========================= */
let x = 100;
let y = window.innerHeight * 0.6;

let vx = 0;
let vy = 0;

const speed = 0.6;
const maxSpeed = 5;
const gravity = 0.5;
const jumpPower = 12;
const maxFallSpeed = 15;

let onGround = false;
let jumpPressed = false;
let controlsVisible = true;

/* =========================
   INPUTS (ÉTAT GLOBAL)
========================= */
const keys = {};

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  if (controlsHint && controlsVisible) {
    controlsHint.style.opacity = "0";
    controlsVisible = false;
  }

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

/* =========================
   GAME LOOP
========================= */
function update() {
  /* --- Lecture inputs --- */
  const leftKey  = keys["q"] || keys["arrowleft"];
  const rightKey = keys["d"] || keys["arrowright"];
  const jumpKey  = keys["z"] || keys[" "] || keys["arrowup"];
  const fallKey  = keys["s"] || keys["arrowdown"];

  /* --- Déplacement horizontal --- */
  if (leftKey) vx -= speed;
  if (rightKey) vx += speed;

  vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
  vx *= onGround ? 0.8 : 0.98;

  /* --- Saut --- */
  if (jumpKey && onGround && !jumpPressed) {
    vy = -jumpPower;
    onGround = false;
    jumpPressed = true;
  }
  if (!jumpKey) jumpPressed = false;

  /* --- Fast fall --- */
  if (fallKey && !onGround) {
    vy += gravity * 2.5;
    vy = Math.min(vy, maxFallSpeed);
  }

  /* --- Gravité --- */
  vy += gravity;

  /* --- Application --- */
  x += vx;
  y += vy;

  /* --- Sol --- */
  const ground = window.innerHeight * 0.7;
  if (y >= ground) {
    y = ground;
    vy = 0;
    onGround = true;
  }

  /* --- Squash & stretch --- */
  player.style.transform = onGround
    ? "scale(1,1)"
    : "scale(1.05,0.95)";

  /* --- Position joueur --- */
  player.style.left = x + "px";
  player.style.top = y + "px";

  /* --- Hint contrôles --- */
  if (controlsHint && controlsVisible) {
    controlsHint.style.left = x + player.offsetWidth / 2 + "px";
    controlsHint.style.top = y + "px";
  }

  /* =========================
     INDICATION [ E ] PORTES ✅
  ========================= */
  let nearDoor = false;

  doors.forEach(door => {
    if (isNear(player, door)) {
      const doorRect = door.getBoundingClientRect();
      const gameRect = game.getBoundingClientRect();

      interactHint.style.left =
        doorRect.left - gameRect.left + doorRect.width / 2 + "px";

      interactHint.style.top =
        doorRect.top - gameRect.top + "px";

      interactHint.style.opacity = "1";
      nearDoor = true;
    }
  });

  if (!nearDoor) {
    interactHint.style.opacity = "0";
  }

  requestAnimationFrame(update);
}

/* =========================
   COLLISIONS
========================= */
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

/* =========================
   PORTES
========================= */
function isNear(a, b, distance = 50) {
  const ax = a.offsetLeft + a.offsetWidth / 2;
  const ay = a.offsetTop + a.offsetHeight / 2;

  const bx = b.offsetLeft + b.offsetWidth / 2;
  const by = b.offsetTop + b.offsetHeight / 2;

  return Math.hypot(ax - bx, ay - by) < distance;
}

/* =========================
   LANCEMENT
========================= */
update();
