// script.js
import { db } from './firebase-init.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const factsCol = collection(db, "funfacts");

async function showRandomFact() {
  const snapshot = await getDocs(factsCol);
  const facts = snapshot.docs.map(doc => doc.data().text);
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("fact").textContent = randomFact;
}

document.getElementById("getFactBtn").addEventListener("click", showRandomFact);

document.getElementById("factForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newFact = document.getElementById("newFact").value;
  if (newFact.trim()) {
    await addDoc(factsCol, { text: newFact });
    alert("Thanks! Your fact has been submitted.");
    document.getElementById("newFact").value = "";
  }
});
