import { db, auth, provider } from './firebase-init.js';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

const factForm = document.getElementById("factForm");
const getFactBtn = document.getElementById("getFactBtn");
const factDisplay = document.getElementById("fact");

const chatContainer = document.getElementById("chat-container");
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// Collections
const factsCol = collection(db, "funfacts");
const messagesCol = collection(db, "messages");

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
  loginBtn.disabled = true;
  signInWithPopup(auth, provider)
    .catch(error => alert("Login failed: " + error.message))
    .finally(() => {
      loginBtn.disabled = false;
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Handle login state changes (unified)
onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.textContent = `👋 Hello, ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    factForm.style.display = "block";
    chatContainer.style.display = "block";

    loadMessages();
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";

    factForm.style.display = "none";
    chatContainer.style.display = "none";

    messagesDiv.innerHTML = "";
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

// Chat: send message
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text === "") return;

  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to send messages!");

  await addDoc(messagesCol, {
    text,
    uid: user.uid,
    displayName: user.displayName,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
});

// Chat: load messages live
function loadMessages() {
  const q = query(messagesCol, orderBy("timestamp", "asc"));
  onSnapshot(q, (querySnapshot) => {
    messagesDiv.innerHTML = ""; // clear current messages
    querySnapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.textContent = `${msg.displayName}: ${msg.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // scroll to bottom
  });
}
