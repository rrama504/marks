const basePath = "./"; // because exp folders are in same directory as this file

const experiments = [
  { name: "Experiment 1", path: "exp1", files: ["sourcecode.txt", "testbench.txt"] },
  { name: "Experiment 2", path: "exp2", files: ["sourcecode.txt", "testbench.txt"] },
  { name: "Experiment 3", path: "exp3", files: ["sourcecode.txt", "testbench.txt"] },
  { name: "Experiment 4", path: "exp4", files: ["sourcecode.txt", "testbench.txt"] },
  { name: "Experiment 5", path: "exp5", files: ["sourcecode.txt", "testbench.txt"] },
  { name: "Experiment 6", path: "exp6", files: ["sourcecode.txt", "testbench.txt"] }
];

const fileList = document.getElementById("fileList");
const display = document.getElementById("codeDisplay");
let currentExp = null;

// Create number buttons (1–6)
experiments.forEach((exp, index) => {
  const btn = document.createElement("button");
  btn.textContent = index + 1;
  btn.title = exp.name;
  btn.onclick = () => openExperiment(exp);
  fileList.appendChild(btn);
});

async function openExperiment(exp) {
  currentExp = exp;
  display.innerHTML = `
    <div class="code-sections">
      <div class="block">
        <div class="block-header">
          <h3>Source Code</h3>
          <button class="copy-btn" onclick="copyText('src')">📋</button>
        </div>
        <pre id="src">Loading...</pre>
      </div>

      <div class="block">
        <div class="block-header">
          <h3>Testbench</h3>
          <button class="copy-btn" onclick="copyText('tb')">📋</button>
        </div>
        <pre id="tb">Loading...</pre>
      </div>
    </div>
  `;

  const srcFile = `${basePath}${exp.path}/${exp.files[0]}`;
  const tbFile = `${basePath}${exp.path}/${exp.files[1]}`;

  document.getElementById("src").textContent = await fetchText(srcFile);
  document.getElementById("tb").textContent = await fetchText(tbFile);
}

async function fetchText(filePath) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error("⚠️ Unable to load file");
    return await res.text();
  } catch {
    return "⚠️ File not found";
  }
}

// Copy with indentation preserved
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.textContent;
  if (text.trim()) {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert(`${id === "src" ? "Source Code" : "Testbench"} copied with indentation!`);
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if (key >= "1" && key <= String(experiments.length)) {
    openExperiment(experiments[parseInt(key) - 1]);
  } else if (key === "c" && currentExp) {
    copyText("src");
  } else if (key === "v" && currentExp) {
    copyText("tb");
  }
});
