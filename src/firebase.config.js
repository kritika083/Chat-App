
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCJgDmC8vfUXPd6OtpQ6RewJBUwnQKlpE8",
  authDomain: "homie-squad.firebaseapp.com",
  projectId: "homie-squad",
  storageBucket: "homie-squad.appspot.com",
  messagingSenderId: "1047979757694",
  appId: "1:1047979757694:web:6128d0f12ee4246121482f"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
export {db};