
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


const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");


document.getElementById("loginBtn")?.addEventListener("click", async () => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);

        
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

document.getElementById("registerBtn")?.addEventListener("click", async () => {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        await sendEmailVerification(userCred.user);
        alert("Registered. Verification email sent. Please check your inbox.");
    } catch (err) {
        alert("Registration failed: " + err.message);
    }
});


document.getElementById("resetPasswordBtn")?.addEventListener("click", async () => {
    try {
        await sendPasswordResetEmail(auth, emailInput.value);
        alert("Password reset email sent.");
    } catch (err) {
        alert("Reset failed: " + err.message);
    }
});

document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        
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

onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        checkProfileAndRedirect(user.uid);

    }
});
import { db, doc, getDoc } from './firebase.js'; 

async function checkProfileAndRedirect(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        window.location.href = "end.html"; 
    } else {
        window.location.href = "profile-setup.html"; 
    }
}