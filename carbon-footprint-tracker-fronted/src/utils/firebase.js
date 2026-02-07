import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "carbon-footprint-2cb1f.firebaseapp.com",
  projectId: "carbon-footprint-2cb1f",
  appId: "1:970886087021:web:e2801abdaf026e50639a64",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
