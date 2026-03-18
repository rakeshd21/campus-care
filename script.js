import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const storage = getStorage();
const catIcons = { Infrastructure:'🏗️', Academics:'📚', Hostel:'🏠', Transport:'🚌', WiFi:'📶', Library:'📖', Sports:'⚽', Other:'💬' };
const catColors = { Infrastructure:'#4f8ef7', Academics:'#fbbf24', Hostel:'#f472b6', Transport:'#34d399', WiFi:'#38bdf8', Library:'#a78bfa', Sports:'#fb923c', Other:'#94a3b8' };

// ── SUBMIT ──
window.submitComplaint = async function () {
  const name     = document.getElementById("name").value.trim();
  const rollNo   = document.getElementById("rollNo").value.trim();
  const category = document.getElementById("category").value;
  const issue    = document.getElementById("issue").value.trim();
  const location = document.getElementById("location").value.trim();
  const desc     = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const file     = document.getElementById("image").files[0];

  if (!name || !issue) {
    showToast("⚠️ Please enter your name and problem title", "err");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerHTML = '<span>Submitting...</span>';

  try {
    let imageUrl = "";
    if (file) {
      const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "complaints"), {
      name,
      rollNo,
      category,
      issue,
      location,
      description: desc,
      priority,
      imageUrl,
      status: "pending",
      adminNote: "",
      createdAt: serverTimestamp()
    });

    showToast("✅ Report submitted successfully!", "ok");
    clearForm();
  } catch (err) {
    console.error(err);
    showToast("❌ Failed to submit. Check console.", "err");
  }

  btn.disabled = false;
  btn.innerHTML = '<span>Submit Report</span> →';
};

// ── LOAD ALL COMPLAINTS ──
async function loadComplaints() {
  const list = document.getElementById("list");
  list.innerHTML = '<div class="spinner"></div>';

  try {
    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = '<div class="empty"><div class="e-icon">📋</div><p>No complaints submitted yet</p></div>';
      return;
    }

    const html = snap.docs.map(d => {
      const c = d.data();
      const color  = catColors[c.category] || '#6b7280';
      const icon   = catIcons[c.category]  || '💬';
      const date   = c.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) || '—';
      const prioClass = { high:'b-high', medium:'b-medium', low:'b-low' }[c.priority] || 'b-low';
      const statClass = { pending:'b-pending', 'in-progress':'b-progress', resolved:'b-resolved' }[c.status] || 'b-pending';

      return `
        <div class="r-card">
          <div class="r-icon" style="background:${color}18;color:${color}">${icon}</div>
          <div class="r-body">
            <div class="r-title">${c.issue}</div>
            ${c.description ? `<div class="r-desc">${c.description}</div>` : ''}
            <div class="r-meta">
              <span class="badge ${statClass}">${c.status}</span>
              ${c.priority ? `<span class="badge ${prioClass}">${c.priority}</span>` : ''}
              ${c.location ? `<span style="font-size:0.75rem;color:var(--text3)">📍 ${c.location}</span>` : ''}
              <span class="r-date">${date}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text2);margin-top:6px">
              by <strong>${c.name}</strong>${c.rollNo ? ` · ${c.rollNo}` : ''}
            </div>
            ${c.adminNote ? `<div class="r-note">💬 Admin: ${c.adminNote}</div>` : ''}
          </div>
          ${c.imageUrl ? `<img class="r-img" src="${c.imageUrl}" alt="Issue photo">` : ''}
        </div>
      `;
    }).join('');

    list.innerHTML = `<div class="reports-grid">${html}</div>`;
  } catch (err) {
    console.error(err);
    list.innerHTML = '<div class="empty"><div class="e-icon">❌</div><p>Failed to load reports</p></div>';
  }
}

// Expose for tab switch
window._loadComplaints = loadComplaints;
loadComplaints();