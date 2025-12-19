// Import Firebase modules and methods
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from './firebase.js';

// Get references to input fields
const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");

// LOGIN
document.getElementById("loginBtn")?.addEventListener("click", async () => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);

        // Ensure user has verified their email
        if (!userCred.user.emailVerified) {
            await sendEmailVerification(userCred.user);
            alert("Email not verified. Verification email sent.");
            await signOut(auth);
            return;
        }

        checkProfileAndRedirect(userCred.user.uid);

    } catch (err) {
        alert("Login failed: " + err.message);
    }
});

// REGISTER
document.getElementById("registerBtn")?.addEventListener("click", async () => {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        await sendEmailVerification(userCred.user);
        alert("Registered. Verification email sent. Please check your inbox.");
    } catch (err) {
        alert("Registration failed: " + err.message);
    }
});

// RESET PASSWORD
document.getElementById("resetPasswordBtn")?.addEventListener("click", async () => {
    try {
        await sendPasswordResetEmail(auth, emailInput.value);
        alert("Password reset email sent.");
    } catch (err) {
        alert("Reset failed: " + err.message);
    }
});

// GOOGLE LOGIN
document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Ensure Google user's email is verified
        if (!user.emailVerified) {
            await sendEmailVerification(user);
            alert("Verification email sent. Please verify.");
            await signOut(auth);
            return;
        }

        checkProfileAndRedirect(user.uid);

    } catch (err) {
        alert("Google login failed: " + err.message);
    }
});

// REDIRECT IF ALREADY LOGGED IN AND VERIFIED
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        checkProfileAndRedirect(user.uid);

    }
});
import { db, doc, getDoc } from './firebase.js'; // ⬅ Make sure to import these if not already

async function checkProfileAndRedirect(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        window.location.href = "end.html"; // Profile exists
    } else {
        window.location.href = "profile-setup.html"; // New user, needs setup
    }
}