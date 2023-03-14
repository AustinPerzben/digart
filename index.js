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

export let app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function saveData() {
  console.log("Connecting to database...");
  let txt_field = document.getElementById("name");
  if (txt_field.value == "") {
    txt_field.placeholder = "Please enter a name!";
    return;
  } else if (txt_field.value.includes("admin")) {
    loadData(txt_field.value);
    txt_field.value = "";
    txt_field.placeholder = "Loading...";
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

export function loadData(_str) {
  console.log(_str);
  let key = "";
  if (_str.includes("-")) {
    key = _str.split("-")[1];
  }
  console.log(key);
  const reference = ref(db, "tutorial/" + key);
  onValue(reference, (snapshot) => {
    let data = snapshot.val();
    let keys = Object.keys(data);
    let values = Object.values(data);
    console.log("Reading database...");
    console.log(keys, values);
    for (let i = 0; i < keys.length; i++) {
      const obj = values[i];
      if (key == "" && obj.path == undefined) {
        delete data[keys[i]];
      } else if (key == keys[i]) {
        data = obj;
      }
    }
    console.log(data);
    document.getElementById("name").placeholder = "Enter your name";
    visualizeData(data);
  });
}