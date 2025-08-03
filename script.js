let user = localStorage.getItem("currentUser") || "Joueur1";
let users = JSON.parse(localStorage.getItem("users")) || {};
if (!users[user]) {
  users[user] = {
    kh: 0,
    xp: 0,
    level: 1,
    energy: 100,
    deadspot: 0,
    energyUpgradeLevel: 0,
    clickMultiplier: 1,
    clickUpgradeLevel: 0
  };
}
let data = users[user];

document.getElementById("welcome").textContent = `Bienvenue, ${user}!`;

function updateDisplay() {
  document.getElementById("kh").textContent = data.kh.toFixed(10);
  document.getElementById("xp").textContent = data.xp;
  document.getElementById("level").textContent = data.level;
  document.getElementById("xpNeed").textContent = Math.floor(100 * Math.pow(1.027, data.level - 1));
  document.getElementById("energy").textContent = data.energy.toFixed(0);
  document.getElementById("energyFill").style.width = `${data.energy}%`;
  document.getElementById("deadspot").textContent = data.deadspot.toFixed(0);
  document.getElementById("clickValue").textContent = (0.0000000001 * data.clickMultiplier).toFixed(10);
}
function save() {
  users[user] = data;
  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("clickButton").onclick = () => {
  if (data.energy < 2) return;
  data.kh += 0.0000000001 * data.clickMultiplier;
  data.xp += 1;
  data.deadspot += 1 * data.clickMultiplier;
  data.energy -= 2;

  const needed = 100 * Math.pow(1.027, data.level - 1);
  if (data.xp >= needed) {
    data.level += 1;
    data.xp = 0;
  }
  save();
  updateDisplay();
};

document.getElementById("upgradeButton").onclick = () => {
  const cost = 20 * Math.pow(1.0324, data.energyUpgradeLevel);
  if (data.deadspot >= cost) {
    data.deadspot -= cost;
    data.energyUpgradeLevel += 1;
    data.energy = Math.min(data.energy + 50, 100);
    alert("✅ Énergie améliorée !");
    save();
    updateDisplay();
  } else {
    alert("❌ Pas assez de Deadspot !");
  }
};

document.getElementById("clickUpgradeButton").onclick = () => {
  const cost = 50 * Math.pow(2, data.clickUpgradeLevel);
  if (data.deadspot >= cost) {
    data.deadspot -= cost;
    data.clickUpgradeLevel += 1;
    data.clickMultiplier = data.clickUpgradeLevel + 1;
    alert(`✅ Bonus de clic x${data.clickMultiplier} activé !`);
    save();
    updateDisplay();
  } else {
    alert("❌ Pas assez de Deadspot !");
  }
};

function withdraw() {
  const amount = parseInt(document.getElementById("withdrawAmount").value);
  const wallet = document.getElementById("wallet").value;
  const crypto = document.getElementById("crypto").value;

  if (data.deadspot >= 50000 && amount <= data.deadspot && wallet) {
    alert(`✅ Retrait de ${amount} Deadspot vers ${wallet} en ${crypto} accepté.`);
    data.deadspot -= amount;
    save();
    updateDisplay();
  } else {
    alert("❌ Montant invalide ou Deadspot insuffisant (minimum 50000).");
  }
}

// Recharge d'énergie automatique
setInterval(() => {
  if (data.energy < 100) {
    data.energy += 1;
    if (data.energy > 100) data.energy = 100;
    save();
    updateDisplay();
  }
}, 1000);

// Leaderboard
function updateLeaderboard() {
  const topUsers = Object.entries(users)
    .sort((a, b) => b[1].deadspot - a[1].deadspot)
    .slice(0, 5);
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  topUsers.forEach(([name, stats]) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${stats.deadspot.toFixed(0)} Deadspot`;
    list.appendChild(li);
  });
}

updateDisplay();
updateLeaderboard();
