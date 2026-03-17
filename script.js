import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("complaintForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const issue = document.getElementById("issue").value;

  try {
    await addDoc(collection(db, "complaints"), {
      name: name,
      issue: issue,
      status: "pending"
    });

    alert("Complaint submitted!");
    form.reset();
  } catch (error) {
    console.error(error);
  }
});