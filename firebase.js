// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0ySaX6Xqsu-XMIRZtlySBL612mnnM99I",
  authDomain: "campus-cart-fc7a1.firebaseapp.com",
  projectId: "campus-cart-fc7a1",
  storageBucket: "campus-cart-fc7a1.appspot.com",
  messagingSenderId: "124489655000",
  appId: "1:124489655000:web:d501245aa33bf5611badad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Save profile data to Firestore (without image upload)
async function saveProfileData(userId, profileData) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profileData); // Store profile data without image
    console.log("Profile data saved successfully.");
  } catch (error) {
    console.error("Error saving profile data:", error);
    alert("There was an error saving the profile.");
  }
}


// Update existing profile data
async function updateProfileData(userId, profileData) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, profileData); // Update user data in Firestore
  } catch (error) {
    console.error("Error updating profile data:", error);
  }
}

// Get user profile data from Firestore
async function getProfileData(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data(); // Return profile data
    } else {
      console.log("No profile data found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving profile data:", error);
  }
}

// Export modules and functions
export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  googleProvider,
  sendPasswordResetEmail,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  saveProfileData,
  updateProfileData,
  getProfileData
};