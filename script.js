import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const storage = getStorage();

const form = document.getElementById("form");
const list = document.getElementById("list");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const issue = document.getElementById("issue").value;
  const file = document.getElementById("image").files[0];

  let imageUrl = "";

  if (file) {
    const storageRef = ref(storage, "images/" + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "complaints"), {
    name,
    issue,
    imageUrl,
    status: "pending"
  });

  alert("Submitted!");
  load();
});

async function load() {
  list.innerHTML = "";
  const data = await getDocs(collection(db, "complaints"));

  data.forEach((doc) => {
    const d = doc.data();

    list.innerHTML += `
      <div class="card">
        <p><b>${d.name}</b>: ${d.issue}</p>
        <p>Status: ${d.status}</p>
        ${d.imageUrl ? `<img src="${d.imageUrl}" width="100">` : ""}
      </div>
    `;
  });
}

load();