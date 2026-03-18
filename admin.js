import { db } from "./firebase.js";
import {
  collection, getDocs, doc, updateDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const catIcons  = { Infrastructure:'🏗️', Academics:'📚', Hostel:'🏠', Transport:'🚌', WiFi:'📶', Library:'📖', Sports:'⚽', Other:'💬' };
const catColors = { Infrastructure:'#4f8ef7', Academics:'#fbbf24', Hostel:'#f472b6', Transport:'#34d399', WiFi:'#38bdf8', Library:'#a78bfa', Sports:'#fb923c', Other:'#94a3b8' };

let allReports = [];    // cache from Firestore
let currentId  = null;  // report being edited

// ── LOGIN ──
window.login = function () {
  const u = document.getElementById("aUser").value.trim();
  const p = document.getElementById("aPass").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboard").style.display  = "flex";
    loadAll();
  } else {
    showToast("❌ Invalid username or password", "err");
  }
};

window.logout = function () {
  document.getElementById("dashboard").style.display  = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("aPass").value = "";
};

// ── LOAD ALL FROM FIRESTORE ──
window.loadAll = async function () {
  document.getElementById("tbody").innerHTML = '<tr><td colspan="8"><div class="spinner"></div></td></tr>';
  try {
    const q    = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    allReports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    computeStats();
    applyFilters();
    document.getElementById("lastUpdated").textContent =
      `Last refreshed: ${new Date().toLocaleTimeString('en-IN')}`;
  } catch (err) {
    console.error(err);
    showToast("❌ Failed to load from Firebase", "err");
    document.getElementById("tbody").innerHTML =
      '<tr><td colspan="8"><div class="empty"><div class="e-icon">❌</div><p>Could not load data. Check Firebase config.</p></div></td></tr>';
  }
};

// ── STATS ──
function computeStats() {
  const total    = allReports.length;
  const pending  = allReports.filter(r => r.status === "pending").length;
  const progress = allReports.filter(r => r.status === "in-progress").length;
  const resolved = allReports.filter(r => r.status === "resolved").length;
  const high     = allReports.filter(r => r.priority === "high").length;

  document.getElementById("sTotal").textContent    = total;
  document.getElementById("sPending").textContent  = pending;
  document.getElementById("sProgress").textContent = progress;
  document.getElementById("sResolved").textContent = resolved;
  document.getElementById("sHigh").textContent     = high;
}

// ── FILTERS ──
window.applyFilters = function () {
  const fStatus   = document.getElementById("fStatus").value;
  const fCategory = document.getElementById("fCategory").value;
  const fPriority = document.getElementById("fPriority").value;

  const filtered = allReports.filter(r => {
    if (fStatus   && r.status   !== fStatus)   return false;
    if (fCategory && r.category !== fCategory) return false;
    if (fPriority && r.priority !== fPriority) return false;
    return true;
  });

  document.getElementById("rCount").textContent =
    `${filtered.length} report${filtered.length !== 1 ? 's' : ''}`;

  renderTable(filtered);
};

// ── RENDER TABLE ──
function renderTable(reports) {
  const tbody = document.getElementById("tbody");

  if (!reports.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty"><div class="e-icon">🎉</div><p>No reports match the current filters</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = reports.map(r => {
    const icon     = catIcons[r.category]  || '💬';
    const color    = catColors[r.category] || '#6b7280';
    const prioMap  = { high:'b-high', medium:'b-medium', low:'b-low' };
    const statMap  = { pending:'b-pending', 'in-progress':'b-progress', resolved:'b-resolved' };
    const date     = r.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) || '—';
    const noteEsc  = (r.adminNote || '').replace(/'/g, "\\'");
    const titleEsc = (r.issue     || '').replace(/'/g, "\\'");
    const descEsc  = (r.description || '').slice(0,80).replace(/'/g, "\\'");

    return `
      <tr>
        <td>
          ${r.imageUrl
            ? `<img class="img-thumb" src="${r.imageUrl}" alt="photo">`
            : `<div class="no-img">No<br>img</div>`}
        </td>
        <td>
          <div class="td-name">${r.name || '—'}</div>
          ${r.rollNo ? `<div class="td-email">${r.rollNo}</div>` : ''}
          ${r.location ? `<div style="font-size:0.75rem;color:var(--text3);margin-top:2px">📍 ${r.location}</div>` : ''}
        </td>
        <td style="max-width:240px">
          <div class="td-title">${r.issue || '—'}</div>
          ${r.description ? `<div class="td-desc">${r.description}</div>` : ''}
          ${r.adminNote ? `<div style="font-size:0.75rem;color:var(--accent);margin-top:4px">💬 ${r.adminNote}</div>` : ''}
        </td>
        <td>
          <span style="display:inline-flex;align-items:center;gap:5px;background:${color}12;border:1px solid ${color}30;color:${color};padding:4px 10px;border-radius:8px;font-size:0.78rem;font-weight:600">
            ${icon} ${r.category || '—'}
          </span>
        </td>
        <td><span class="badge ${prioMap[r.priority] || 'b-low'}">${r.priority || 'low'}</span></td>
        <td><span class="badge ${statMap[r.status]   || 'b-pending'}">${r.status || 'pending'}</span></td>
        <td class="td-date">${date}</td>
        <td>
          <button class="btn btn-ghost btn-sm"
            onclick="openModal('${r.id}','${r.status}','${noteEsc}','${titleEsc}','${descEsc}')">
            Update
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ── MODAL ──
window.openModal = function (id, status, note, title, desc) {
  currentId = id;
  document.getElementById("mStatus").value = status || "pending";
  document.getElementById("mNote").value   = note || "";
  document.getElementById("modalDetail").innerHTML =
    `<strong>${title}</strong>${desc ? `<br>${desc}${desc.length >= 80 ? '…' : ''}` : ''}`;
  document.getElementById("modalBg").classList.add("open");
};

window.saveUpdate = async function () {
  if (!currentId) return;
  const status    = document.getElementById("mStatus").value;
  const adminNote = document.getElementById("mNote").value.trim();

  try {
    await updateDoc(doc(db, "complaints", currentId), { status, adminNote });
    showToast("✅ Report updated!", "ok");
    closeModal();
    // Update local cache too
    const idx = allReports.findIndex(r => r.id === currentId);
    if (idx !== -1) { allReports[idx].status = status; allReports[idx].adminNote = adminNote; }
    computeStats();
    applyFilters();
  } catch (err) {
    console.error(err);
    showToast("❌ Failed to update", "err");
  }
};