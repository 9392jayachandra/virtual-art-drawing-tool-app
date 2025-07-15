const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let currentColor = "#ffffff";
let textMode = false;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener("mousedown", (e) => {
  if (textMode) {
    const text = document.getElementById("textInput").value;
    if (text) {
      ctx.fillStyle = currentColor;
      ctx.font = "20px Arial";
      ctx.fillText(text, e.offsetX, e.offsetY);
      textMode = false;
    }
  } else {
    drawing = true;
    draw(e);
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function setColor(color) {
  currentColor = color;
  document.getElementById("colorPicker").value = color;
}

document.getElementById("colorPicker").addEventListener("input", function () {
  currentColor = this.value;
});

function enableText() {
  textMode = true;
}

function clearCanvas() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function downloadImage() {
  const dataURL = canvas.toDataURL("image/png");
  const filename = prompt("Enter file name:", "my_drawing") || "drawing";
  const cleanedName = filename.replace(/\s+/g, "_") + ".png";

  let drawings = JSON.parse(localStorage.getItem("drawings") || "[]");
  drawings.push({ name: cleanedName, data: dataURL });
  localStorage.setItem("drawings", JSON.stringify(drawings));

  const link = document.createElement("a");
  link.download = cleanedName;
  link.href = dataURL;
  link.click();

  showSavedImages();
}

function showSavedImages() {
  const savedLinks = document.getElementById("savedLinks");
  savedLinks.innerHTML = "";

  let drawings = JSON.parse(localStorage.getItem("drawings") || "[]");
  drawings = drawings.filter(item => item && item.data && item.name);
  localStorage.setItem("drawings", JSON.stringify(drawings));

  drawings.forEach(d => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = d.data;
    a.download = d.name;
    a.textContent = d.name;
    li.appendChild(a);
    savedLinks.appendChild(li);
  });
}

window.onload = showSavedImages;

const statusText = document.getElementById("status");
function updateNetworkStatus() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!navigator.onLine) {
    statusText.textContent = "⚠️ Offline. Drawings saved locally.";
    statusText.style.color = "orange";
  } else {
    statusText.textContent = `✅ Online (${connection?.effectiveType || "good"})`;
    statusText.style.color = "#00ff88";
  }
}
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();

