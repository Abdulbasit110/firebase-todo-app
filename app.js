import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  query,
  onSnapshot,
  deleteDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjbpMY_CpviPHHKuBk_ytJeVmXRFqEMYA",
  authDomain: "basit-todo-app.firebaseapp.com",
  projectId: "basit-todo-app",
  storageBucket: "basit-todo-app.appspot.com",
  messagingSenderId: "506034941251",
  appId: "1:506034941251:web:ce3925f3af5e7ba7e193f6",
  measurementId: "G-ZG9Z0FS2JT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const input = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todos = document.getElementById("todos");

// reading realtime data
const readTodo = async () => {
  let item = "";
  const q = query(collection(db, "todos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const cities = [];
    querySnapshot.forEach((doc) => {
      cities.push(doc.data());
    });

    item = cities
      .map(
        (todoObj) =>
          `<li class="font-bold m-3" data-id = "${todoObj.id}">${todoObj.todo}<span><sub class="ms-2">${todoObj.time}</sub></span><button class="btn btn-error ms-3">done</button></li>`
      )
      .join("");

    todos.innerHTML = item;

    const deleteButtons = todos.querySelectorAll("button");

    deleteButtons.forEach((button, i) => {
      button.addEventListener("click", async () => {
        const id = cities[i].id;
        deleteTodo(id);
      });
    });
  });
};

readTodo();

// adding to firebase
const add = async () => {
  const id = new Date().getTime();
  const todo = {
    todo: input.value,
    time: new Date().toLocaleString(),
    id,
  };
  if (todo) {
    await setDoc(doc(db, "todos", `${id}`), todo);
    input.value = "";
  }
};

// delete function
const deleteTodo = async (id) => {
  try {
    // Delete the document from Firestore
    await deleteDoc(doc(db, "todos", `${id}`));
    console.log("Document successfully deleted from Firestore!", id);

    // Remove the corresponding <li> element from the screen
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.remove();
      console.log("Element removed from the screen!");
    }
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

// realtime changes
const changes = async () => {
  const q = query(collection(db, "todos"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New city: ", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("Modified city: ", change.doc.data());
      }
      if (change.type === "removed") {
        const id = change.doc.data().id;
        const li = document.querySelector(`[data-id="${id}"]`);
        li.remove();
        console.log("Removed city: ", change.doc.data());
      }
    });
  });
};

changes();

addButton.addEventListener("click", add);
