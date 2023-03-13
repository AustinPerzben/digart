// === GLOBALS === //
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBhWygDUviicrrudYLmnSrXQ8Z4sh4DZD4",
  authDomain: "capstone-space.firebaseapp.com",
  projectId: "capstone-space",
  storageBucket: "capstone-space.appspot.com",
  messagingSenderId: "930500695794",
  appId: "1:930500695794:web:3ca9c01512c1385a3ce26b",
  measurementId: "G-TKCFZJHVCB",
};
// // Get a reference to the database service
// const auth = getAuth(app);
// // All the regions, channels, and memes

// onAuthStateChanged(auth, (user) => {
//   if (user != null) {
//     console.log("User is signed in");
//   } else {
//     console.log("User is not signed in");
//   }
// });
export let app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function saveData() {
  console.log("Saving data to database...");
  let txt_field = document.getElementById("name");
  if (txt_field.value == "") {
    txt_field.placeholder = "Please enter a name!";
    return;
  } else if (txt_field.value == "admin") {
    loadData();
    return;
  }

  const reference = ref(db, "tutorial/" + txt_field.value);
  set(reference, {
    path: drawing[0],
    color: palette[0]
  });
  txt_field.value = "";
  txt_field.placeholder = "Thanks!"
  setTimeout(() => {
    txt_field.placeholder = "Enter your name";
  }, 3000);
  console.log("Wrote data to database");
}

export function loadData() {
  const reference = ref(db, "tutorial/");
  onValue(reference, (snapshot) => {
    let data = snapshot.val();
    console.log("Reading database...");
    visualizeData(data);
  });
}