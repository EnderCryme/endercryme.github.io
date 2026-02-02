/* =========================
   RÉFÉRENCES DOM
========================= */
const player = document.getElementById("player");
const doors = document.querySelectorAll(".door");
const controlsHint = document.getElementById("controls-hint");

/* =========================
   INPUTS
========================= */
const keys = {};
let controlsVisible = true;

const blockedKeys = [
  " ",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright"
];

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (blockedKeys.includes(key)) {
    e.preventDefault(); // 🚫 empêche le scroll
  }

  keys[key] = true;

  if (controlsHint && controlsVisible) {
    controlsHint.style.opacity = "0";
    controlsHint.style.transition = "opacity 0.4s ease";
    controlsVisible = false;
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();

  if (blockedKeys.includes(key)) {
    e.preventDefault();
  }

  keys[key] = false;
});

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

/* =========================
   GAME LOOP
========================= */
function update() {

  /* --- Inputs logiques --- */
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

  if (!jumpKey) {
    jumpPressed = false;
  }

  /* --- Gravité --- */
  vy += gravity;

  /* --- Fast-fall --- */
  if (fallKey && !onGround) {
    vy += gravity * 2.5;
  }

  vy = Math.min(vy, maxFallSpeed);

  /* --- Application des vitesses --- */
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
    ? "scale(1, 1)"
    : "scale(1.05, 0.95)";

  /* --- Position DOM --- */
  player.style.left = x + "px";
  player.style.top = y + "px";

  /* --- Position aide ZQSD --- */
  if (controlsHint && controlsVisible) {
    controlsHint.style.left = (x + player.offsetWidth / 2) + "px";
    controlsHint.style.top = (y - 10) + "px";
  }

  /* --- Collisions portes --- */
  doors.forEach((door) => {
    if (isColliding(player, door)) {
      openDoor(door);
    }
  });

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
let doorOpened = false;

function openDoor(door) {
  if (doorOpened) return;

  doorOpened = true;
  alert("Ouverture : " + door.dataset.section);
}

/* =========================
   LANCEMENT
========================= */
update();
