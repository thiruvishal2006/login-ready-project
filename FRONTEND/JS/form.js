/* form.js — project details form: auth guard, dynamic modules,
   and PDF report generation via jsPDF */

const currentUser = sessionStorage.getItem("pp_logged_in_user");
if (!currentUser) {
  window.location.href = "index.html";
}
document.getElementById("welcome-text").textContent = "Signed in as " + currentUser;
document.getElementById("logout-btn").addEventListener("click", function () {
  sessionStorage.removeItem("pp_logged_in_user");
  window.location.href = "index.html";
});

const moduleCountInput = document.getElementById("module-count");
const modulesContainer = document.getElementById("modules-container");

function generateModuleFields(count) {
  const existingValues = Array.from(modulesContainer.querySelectorAll(".module-name")).map((el) => el.value);
  const existingDetails = Array.from(modulesContainer.querySelectorAll(".module-detail")).map((el) => el.value);

  modulesContainer.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const wrap = document.createElement("div");
    wrap.className = "module-entry";
    wrap.innerHTML = `
      <div class="module-index">Module ${i + 1}</div>
      <label>Module Name</label>
      <input type="text" class="module-name" data-index="${i}" value="${existingValues[i] || ""}">
      <label>Module Details</label>
      <textarea class="module-detail" data-index="${i}">${existingDetails[i] || ""}</textarea>
    `;
    modulesContainer.appendChild(wrap);
  }
}

moduleCountInput.addEventListener("input", function () {
  const count = parseInt(moduleCountInput.value, 10);
  if (!count || count < 1) {
    modulesContainer.innerHTML = "";
    return;
  }
  generateModuleFields(Math.min(count, 20));
});

document.getElementById("project-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value.trim(),
    abstract: document.getElementById("abstract").value.trim(),
    description: document.getElementById("description").value.trim(),
    literature: document.getElementById("literature").value.trim(),
    otherDetails: document.getElementById("other-details").value.trim(),
    modules: Array.from(document.querySelectorAll(".module-entry")).map((entry) => ({
      name: entry.querySelector(".module-name").value.trim(),
      detail: entry.querySelector(".module-detail").value.trim(),
    })),
  };

  if (!data.title || !data.abstract || !data.description || !data.literature) {
    alert("Please fill in Project Title, Abstract, Description and Literature Survey.");
    return;
  }
  if (data.modules.length === 0) {
    alert("Please enter the number of modules and fill in module details.");
    return;
  }

  // TODO: BACKEND — send `data` to your teammate's API here if needed.

  generatePdfReport(data);
});

function generatePdfReport(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  let y = 60;

  function addHeading(text) {
    if (y > 760) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(140, 108, 30);
    doc.text(text, margin, y);
    doc.setTextColor(0);
    y += 18;
  }

  function addBody(text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text || "-", maxWidth);
    lines.forEach((line) => {
      if (y > 780) { doc.addPage(); y = 60; }
      doc.text(line, margin, y);
      y += 15;
    });
    y += 10;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text("Semester Mini Project Report", margin, y);
  y += 6;
  doc.setDrawColor(180, 145, 45);
  doc.setLineWidth(1);
  doc.line(margin, y + 10, pageWidth - margin, y + 10);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text("Developed by: R.S. Thiru Vishal, K.B. Naveen, Y. Saran", margin, y);
  doc.setTextColor(0);
  y += 26;

  addHeading("Project Title");
  addBody(data.title);

  addHeading("Abstract");
  addBody(data.abstract);

  addHeading("Project Description");
  addBody(data.description);

  addHeading("Literature Survey");
  addBody(data.literature);

  if (data.otherDetails) {
    addHeading("Other Details");
    addBody(data.otherDetails);
  }

  addHeading("Modules (" + data.modules.length + ")");
  data.modules.forEach((mod, i) => {
    if (y > 780) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text((i + 1) + ". " + (mod.name || "Untitled module"), margin, y);
    y += 15;
    addBody(mod.detail);
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("R.S. Thiru Vishal · K.B. Naveen · Y. Saran", margin, doc.internal.pageSize.getHeight() - 25);
    doc.text("Page " + p + " of " + pageCount, pageWidth - margin, doc.internal.pageSize.getHeight() - 25, { align: "right" });
    doc.setTextColor(0);
  }

  const fileSafeTitle = (data.title || "project-report").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(fileSafeTitle + "-report.pdf");
}