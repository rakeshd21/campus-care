import { db } from "./firebase.js";
import {
  collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("adminList");

window.login = function () {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("panel").style.display = "block";
    load();
  } else {
    alert("Wrong login");
  }
};

async function load() {
  list.innerHTML = "";
  const data = await getDocs(collection(db, "complaints"));

  data.forEach((d) => {
    const c = d.data();

    list.innerHTML += `
      <div class="card">
        <p><b>${c.name}</b>: ${c.issue}</p>
        <p>Status: ${c.status}</p>
        ${c.imageUrl ? `<img src="${c.imageUrl}" width="100">` : ""}
        <button onclick="updateStatus('${d.id}')">Mark Resolved</button>
      </div>
    `;
  });
}

window.updateStatus = async (id) => {
  const refDoc = doc(db, "complaints", id);
  await updateDoc(refDoc, { status: "resolved" });
  load();
};