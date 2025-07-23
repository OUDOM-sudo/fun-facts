import { db, auth, provider } from './firebase-init.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const factsCol = collection(db, "funfacts");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const factForm = document.getElementById("factForm");
const getFactBtn = document.getElementById("getFactBtn");
const factDisplay = document.getElementById("fact");

// Show a random fact from Firestore
async function showRandomFact() {
  const snapshot = await getDocs(factsCol);
  const facts = snapshot.docs.map(doc => doc.data().text);
  if (facts.length === 0) {
    factDisplay.textContent = "No facts found yet!";
    return;
  }
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  factDisplay.textContent = randomFact;
}

// Login with Google popup
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(error => {
    alert("Login failed: " + error.message);
  });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Handle login state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.textContent = `👋 Hello, ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    factForm.style.display = "block";
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    factForm.style.display = "none";
  }
});

// Submit new fact (only when logged in)
factForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newFact = document.getElementById("newFact").value;
  if (newFact.trim()) {
    await addDoc(factsCol, { text: newFact });
    alert("Thanks! Your fact has been submitted.");
    document.getElementById("newFact").value = "";
  }
});

// Show a fact when button is clicked
getFactBtn.addEventListener("click", showRandomFact);
